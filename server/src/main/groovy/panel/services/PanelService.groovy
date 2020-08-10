package panel.services

import groovy.transform.CompileStatic
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import panel.clients.CuboDatabaseClient
import panel.clients.FviberiDatabaseClient
import panel.clients.PanelDatabaseClient
import panel.pogos.appointmentDays.AppointmentDay
import panel.pogos.appointmentDays.AppointmentType
import panel.pogos.appointmentDays.AppointmentType.AppointmentTypeCode
import panel.pogos.appointmentDays.AppointmentTypeValues
import panel.pogos.appointmentDays.UpdateAppointmentDays
import panel.pogos.cards.Card
import panel.pogos.cards.Group
import panel.pogos.cards.GroupUnits
import panel.pogos.cards.Task
import panel.pogos.firstLoad.CompleteInfo
import panel.pogos.firstLoad.SyncOrdersSemaphore
import panel.pogos.firstLoad.UpdateCards
import panel.pogos.fviberi.Article
import panel.pogos.fviberi.Order
import panel.pogos.schedules.EmployeeSchedule
import panel.pogos.schedules.JobLineType
import panel.pogos.schedules.Schedule
import panel.pogos.skills.Skill
import panel.utils.Constants

import javax.inject.Inject
import javax.inject.Singleton
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime
import java.time.temporal.ChronoUnit

@Singleton
@CompileStatic
class PanelService {

	private static final Logger LOG = LoggerFactory.getLogger(PanelService)

	@Inject private PanelDatabaseClient panelDatabaseClient
	@Inject private FviberiDatabaseClient fviberiDatabaseClient
	@Inject private CuboDatabaseClient cuboDatabaseClient

	static LocalDate lastScheduleDay

	CompleteInfo getPanelInfo(LocalDate from, LocalDate to) {
		List<JobLineType> jobLineTypes = panelDatabaseClient.getJobLineTypes()
		List<Skill> skills = cuboDatabaseClient.getMechanicsSkills()
		List<AppointmentType> appointmentTypes = panelDatabaseClient.getAppointmentTypes()
		List<AppointmentDay> appointmentDays = panelDatabaseClient.getAppointmentDays(from)
		Map<String, List<EmployeeSchedule>> daysMechanics = getDaysMechanics(from, to)

//		deletePendingCards(from)

		/* El último día para obtener órdenes es el último día que tengan horarios definidos. No tiene sentido que
		*  tengan en la cinta citas de días que ni siquiera pueden asignar */
		UpdateCards updateCards = syncJpdvOrders(LocalDate.now(), lastScheduleDay, appointmentDays, appointmentTypes)
		List<Card> cards = updateCards.getAll().findAll { !it.day || (it.day >= from && it.day <= to) }

		return new CompleteInfo(
			daysMechanics,
			skills,
			jobLineTypes,
			appointmentTypes,
			lastScheduleDay,
			updateCards.appointmentDays ?: appointmentDays,
			cards + updateCards.auxiliary
		)
	}

	static boolean checkAuxiliaryCard(Card card) {
		return card.type == Card.CardType.AUXILIARY
	}

	// region Mechanics

	/**
	 * Get day mechanics and load position if it is not defined yet
	 * @param date Day to get mechanics
	 * @return List of mechanic employees
	 */
	Map<String, List<EmployeeSchedule>> getDaysMechanics(LocalDate from, LocalDate to) {
		List<EmployeeSchedule> mechanics = cuboDatabaseClient.getMechanics(from, to, true)
		lastScheduleDay = cuboDatabaseClient.getLastScheduleDay()
		return integrateFixedMechanics(mechanics)
	}

	static Map<String, List<EmployeeSchedule>> integrateFixedMechanics(List<EmployeeSchedule> mechanics) {
		boolean existentMechanics = mechanics.find { it.day }
		Map<String, List<EmployeeSchedule>> daysMechanics = [:]

		/* Sólo se integran las líneas de taller y tienda si existen otros mecánicos. Si no, no tiene sentido hacerlo,
		*  ya que el horario de las primeras se basa en el de los segundos */
		if (existentMechanics) {
			LocalDate today = LocalDate.now()
            List<EmployeeSchedule> todayMechanics = mechanics.findAll { it.day == today }
            if (!todayMechanics) {
                mechanics = mechanics.findAll { it.day }
            }
			mechanics.each {
				if (!it.day) {
					it.schedule = findThresholdSchedule(todayMechanics)
					it.day = today
				}
				if (!daysMechanics[it.day.toString()]) {
					daysMechanics[it.day.toString()] = []
				}
				daysMechanics[it.day.toString()] << it
			}
		}
		return daysMechanics
	}

	static Schedule findThresholdSchedule(List<EmployeeSchedule> mechanics) {
		LocalTime minMorningStart = mechanics.schedule.morningStart.min()
		LocalTime minAfternoonStart = mechanics.schedule.afternoonStart.min()
		LocalTime maxMorningEnd = mechanics.schedule.morningEnd.max()
		LocalTime maxAfternoonEnd = mechanics.schedule.afternoonEnd.max()

		if (!minMorningStart) {
			return new Schedule(morningStart: minAfternoonStart, morningEnd: maxAfternoonEnd)
		} else if (!minAfternoonStart) {
			return new Schedule(morningStart: minMorningStart, morningEnd: maxMorningEnd)
		} else {
			return new Schedule(morningStart: minMorningStart, morningEnd: maxAfternoonEnd)
		}
	}

	// endregion

	// region Get cards

	void deletePendingCards(LocalDate day) {
		List<Card> pendingCards = panelDatabaseClient.getCards(null, day)
		if (pendingCards) {
			panelDatabaseClient.deleteCards("", pendingCards.collect { it.properties })
		}
	}

	static List<Card> handleOrdersCards(List<Order> orders, List<Card> dbOrdersCards) {
		dbOrdersCards.each { Card card ->
			Order order = orders.find { it.number == card.order.number }
			card.order.lines = order.lines
		}
		return dbOrdersCards
	}

	// endregion

	// region Build cards

	/**
	 * Get orders groups and its units to get the card duration
	 * @param orders List of Order
	 * @param tasks List of all tasks
	 * @return Map with orders and its groups and units
	 */
	static Map<Order, List<GroupUnits>> getOrdersGroupsUnits(List<Order> orders, List<Task> tasks) {
		Map<Order, List<GroupUnits>> ordersGroupsUnits = orders.collectEntries {
			[(it): (getOrderGroups(it, tasks))]
		}
		return ordersGroupsUnits
	}

	/**
	 * Get order groups and units based on its articles
	 * @param order Order from which to get the groups
	 * @param tasks List of all tasks
	 * @return List of GroupUnits
	 */
	static List<GroupUnits> getOrderGroups(Order order, List<Task> tasks) {
		/* Se obtienen las task correspondientes a los artículos de la orden */
		List<Task> orderTasks = filterAbsorbableTasks(tasks.findAll { it.articleCode in order.lines.article.code })

		List<Task> processedTasks = []
		List<GroupUnits> selectedGroupsInfo = []
		orderTasks.each { Task task ->
			boolean alreadyProcessedTask = processedTasks.find { it.articleCode == task.articleCode }
			if (!alreadyProcessedTask) {
				Group selectedGroup = findSelectedGroup(orderTasks, task.groups, processedTasks)
				if (selectedGroup) {
					selectedGroupsInfo << new GroupUnits(
							group: selectedGroup,
							units: getOrderGroupUnits(order, selectedGroup)
					)
					processedTasks += selectedGroup.tasks
				} else {
					LOG.warn("[$order.number][$task.articleCode]$orderTasks.articleCode Group not found for task")
				}
			}
		}
		return selectedGroupsInfo
	}

	/**
	 * Remove absorbable tasks if main tasks exist
	 * @param orderTasks List of order tasks
	 * @return List of filtered task
	 */
	static List<Task> filterAbsorbableTasks(List<Task> orderTasks) {
		List<Task> mainTasks = orderTasks.findAll { !it.absorbable }
		return mainTasks ?: orderTasks
	}

	static Group findSelectedGroup(List<Task> orderTasks, List<Group> groups, List<Task> processedTasks) {
		List<Group> possibleGroups = sortPossibleGroups(groups, processedTasks)
		Group selectedGroup = possibleGroups.find { Group group ->
			List<Task> commonTasks = orderTasks.findAll { it.articleCode in group.tasks.articleCode }
			/* Si el tamaño de las tareas del grupo y las comunes es el mismo, significa que todas las del grupo están
			*  en la orden. Por lo tanto, ese sería el grupo seleccionado */
			return group.tasks.size() == commonTasks.size()
		}
		return selectedGroup
	}

	static List<Group> sortPossibleGroups(List<Group> groups, List<Task> processedTasks) {
		List<Group> sortedGroups = []
		/* Si la tarea tiene agrupaciones asociadas (debería tener siempre, se contempla sólo por prevenir errores) */
		if (groups) {
			/* Se filtran los grupos cuyas unidades aún no hayan sido procesadas. Si un grupo tiene una tarea 1, y esa
			*  tarea ya forma parte de otro grupo creado con anterioridad, no se tiene en cuenta */
			sortedGroups = groups.findAll {
				!it.tasks.find { it.articleCode in processedTasks.articleCode }
			}
			/* Se ordenan primero por número de tareas (grupo con 4 tareas más preferencia que uno de 3), después por
			*  orden del color, y en caso de igualdad, por código de agrupación (únicamente para evitar generación de
			*  agrupaciones distintas) */
			sortedGroups.sort { Group a, Group b ->
				if (b.tasks.size() == a.tasks.size()) {
					if (a.color.order == b.color.order) {
						return a.code <=> b.code
					} else {
						return a.color.order <=> b.color.order
					}
				} else {
					return b.tasks.size() <=> a.tasks.size()
				}
			}
		}
		return sortedGroups
	}

	static List<Float> getOrderGroupUnits(Order order, Group group) {
		return order.lines.findAll {
			it.article.code in group.tasks.articleCode
		}.units.collect { it as Float }
	}

	/**
	 * Build order cards based on order info and groups
	 * @param ordersGroupsUnits Orders with their associated groups and units
	 * @return List of Card
	 */
	List<Card> buildOrdersCards(List<Order> orders, Map<Order, List<GroupUnits>> ordersGroupsUnits) {
		Map<Integer, List<GroupUnits>> durationGroupsUnits = panelDatabaseClient.getDurations(
			(Map<Integer, List<GroupUnits>>) ordersGroupsUnits.collectEntries { [(it.key.number): (it.value)] }
		)

		List<Card> ordersCards = []
		durationGroupsUnits.each { Integer orderNumber, List<GroupUnits> groupsUnits ->
			Order order = orders.find { it.number == orderNumber }
			List<Card> orderCards = []
			if (groupsUnits.duration) {
				groupsUnits.eachWithIndex { GroupUnits groupUnits, int i ->
					Card card = new Card(order, groupUnits.group, groupUnits.units[0], groupUnits.duration)
					orderCards << card
				}
				orderCards.sort { it.group.color.order }
				ordersCards = ordersCards + orderCards
			} else {
				LOG.warn("Duration not found for group: ${groupsUnits.group.code}")
			}
		}
		return ordersCards
	}

	// endregion

	// region Sync orders with cards

	UpdateCards syncJpdvOrders(
		LocalDate from,
		LocalDate lastScheduleDay,
		List<AppointmentDay> appointmentDays = [],
		List<AppointmentType> appointmentTypes = []
	) {
		UpdateCards updateCards = null
		if (SyncOrdersSemaphore.trySyncOrders()) {
			try {
				/* Se obtiene una lista con las órdenes que se deben reflejar en el panel (en función del estado) */
				List<Order> orders = fviberiDatabaseClient.getOrders(Constants.ORDERS_QUERY_STATES, lastScheduleDay)
				/* Se obtiene una lista de fichas del día para comparar con las órdenes y sincronizarlas en la BD */
				List<Card> dbCards = panelDatabaseClient.getCards(from, null)
				List<Card> auxiliaryCards = dbCards.findAll { checkAuxiliaryCard(it) }
				List<Card> notAuxiliaryCards = handleOrdersCards(orders, dbCards.findAll { !checkAuxiliaryCard(it) })

				updateCards = syncOrders(orders, notAuxiliaryCards)
				updateCards.auxiliary = auxiliaryCards

				List<LocalDate> days = []
				for (LocalDate day = from; day <= lastScheduleDay; day = day.plusDays(1)) {
					days << day
				}
				updateCards.appointmentDays = syncAppointmentDays(
					days,
					appointmentDays ?: panelDatabaseClient.getAppointmentDays(from),
					(appointmentTypes ?: panelDatabaseClient.getAppointmentTypes()).findAll { it.counter },
					updateCards.getAll().findAll { it.type == Card.CardType.APPOINTMENT }
				)

				saveCards(updateCards)
			} catch(all) {
				all.printStackTrace()
				updateCards = findDbUpdateCards(from)
			} finally {
				SyncOrdersSemaphore.release()
			}
		} else {
			SyncOrdersSemaphore.waitUntilUnlocked()
			updateCards = findDbUpdateCards(from)
		}
		return updateCards
	}

	UpdateCards findDbUpdateCards(LocalDate from) {
		List<Card> dbCards = panelDatabaseClient.getCards(from, null)
		List<Card> auxiliaryCards = dbCards.findAll { checkAuxiliaryCard(it) }
		return new UpdateCards(dbCards, auxiliaryCards)
	}

	/**
	 * Sync orders with created cards and update them
	 * @param orders List of Order
	 * @return List of Card
	 */
	UpdateCards syncOrders(List<Order> orders, List<Card> dbCards) {
		/* Se obtiene una lista de todas las tareas de las distintas órdenes */
		List<Integer> articlesCodes = ((List<Article>) orders.lines.article.flatten()).findAll { it.labour }.code.unique()
		List<Task> ordersTasks = panelDatabaseClient.getTasks(articlesCodes)

		/* Para cada orden, se obtienen sus agrupaciones y las unidades de cada uno de ellos */
		Map<Order, List<GroupUnits>> ordersGroupsUnits = getOrdersGroupsUnits(orders, ordersTasks)

		/* Se construyen las fichas a partir de la información de ordenes y grupos */
		List<Card> ordersCards = buildOrdersCards(orders, ordersGroupsUnits)

		/* A partir de las órdenes, las fichas guardadas y las recién construidas, se obtienen aquellas que deben ser
		*  actualizadas en DB */
		UpdateCards updateCards = getCardsToUpdate(orders, dbCards, ordersCards)
		return updateCards
	}

	/**
	 * Obtiene las fichas, de las distintas categorías, que se deben cargar en panel
	 * @param orders Lista de órdenes
	 * @param dbCards Lista de fichas de base de datos
	 * @param builtCards Lista de fichas construidas
	 * @return Objeto con las distintas categorías de fichas
	 */
	static UpdateCards getCardsToUpdate(List<Order> orders, List<Card> dbCards, List<Card> builtCards) {
		/* Se obtienen las órdenes cuyas fichas deben ser creadas (número de orden no existe en las fichas actuales) */
		UpdateCards updateCards = handleCardsUpdate(dbCards, builtCards)
		updateCards.deleted = getDeletedCards(orders, dbCards, builtCards)
		fixSameCardsDeletedInfo(updateCards.same, updateCards.deleted)
		return updateCards
	}

	/**
	 * Get cards to create from existent orders, or cards to update
	 * @param dbCards List of cards of the day
	 * @param builtCards Cards built based on orders info
	 * @return UpdateCardsInfo with newCards and cardsToUpdate
	 */
	static UpdateCards handleCardsUpdate(List<Card> dbCards, List<Card> builtCards) {
		UpdateCards updateCards = new UpdateCards()
		builtCards.each { Card builtCard ->
			List<Card> dbOrderCards = dbCards.findAll { it.order.number == builtCard.order.number }

			if (dbOrderCards) {
				/* Se buscan todas las fichas, y no sólo una, ya que puede haber alguna dividida */
				List<Card> dbGroupOrderCards = dbOrderCards.findAll { it.group.code == builtCard.group.code }
				/* Si existe una ficha guardada con la misma agrupación, se comprueba si se ha actualizado algún dato
				*  de la orden */
				if (dbGroupOrderCards) {
					/* Se obtiene el elemento 0, ya que si la ficha estaba dividida, las propiedades de la orden son
					*  las mismas en todas ellas */
					Map<String, Object> orderDifferences = checkUpdatedOrderInfo(dbGroupOrderCards[0], builtCard)
					if (orderDifferences) {
						/* En estos casos, al ser fichas divididas, se devuelven las de base de datos. Por lo tanto,
                        *  su contenido debe actualizarse con el nuevo de la ficha recién creada */
						dbGroupOrderCards = dbGroupOrderCards.collect { updateCardOrderInfo(it, builtCard) }
						/* Si se actualiza la info de la orden, se debe reflejar en todas las posibles fichas divididas,
						*  no sólo en builtCard. Por eso se pasa como parámetro dbGroupOrderCards */
						if (checkResetCards(orderDifferences)) {
							updateCards.reset += dbGroupOrderCards.collect { updateResetCard(it) }
						} else {
							updateCards.updated += dbGroupOrderCards
						}
					} else {
						/* Fichas que no han sufrido ningún cambio, pero deben devolverse para que se carguen en panel.
						*  Se añaden todas las de la lista, en lugar de sólo builtCard, porque si hay alguna dividida
						*  nunca va a construirse; se dividen en panel, pero desde JPDV se generará siempre la ficha
						*  completa original */
						updateCards.same += dbGroupOrderCards
					}
				} else {
					/* Si el grupo de builtCard no coincide con ninguno de dbOrderCards, se comprueba si ha reemplazado
                    * a alguno existente o si es una ficha completamente nueva.
					* La agrupación de la ficha recién construida podría ser muy parecida a alguna de las ya existentes.
					* Si es así, se tendría que sustituir la ficha ya creada por la nueva */
					Card replacedCard = findReplacedCard(dbOrderCards, builtCard)
					if (replacedCard) {
						Map<String, Object> orderDifferences = checkUpdatedOrderInfo(replacedCard, builtCard)
						if (orderDifferences && checkResetCards(orderDifferences)) {
							updateCards.newCards << builtCard
						} else {
							/* En caso de que haya que reemplazar una ficha, se actualiza la posición de la que va a
							*  ocupar su posición. De esta forma, al hacer la carga inicial, ya se asigna
							*  automáticamente */
							updateCards.newReplace << updateReplacedCard(replacedCard, builtCard)
						}
					} else {
						/* Si la nueva ficha no está reemplazando a una ya existente, se crea completamente nueva */
						updateCards.newCards << builtCard
					}
				}
			} else {
				/* Si no se encuentran fichas asociadas al número de orden, significa que builtCard se ha construido
				 * con la nueva orden */
				updateCards.newCards << builtCard
			}
		}

		return updateCards
	}

	/**
	 * Comprueba si las actualizaciones de una orden implican resetear la ficha (ocurre si cambian el día o la hora de
	 * una cita)
	 * @param orderDifferences Mapa con las diferencias de la orden existentes en una ficha
	 */
	static boolean checkResetCards(Map<String, Object> orderDifferences) {
		return orderDifferences.find { it.key in Constants.RESET_NEW_CARDS_PROPERTIES }
	}

	/**
	 * Find the replaced existent card based on its group tasks. If groups are not the same, it is necessary to check
	 * the tasks to know if a card is replacing another, or if it a completely new card
	 * @param dayOrderCards Saved order cards
	 * @param builtCard Built card
	 * @return Replaced card
	 */
	static Card findReplacedCard(List<Card> dbOrderCards, Card builtCard) {
		List<Integer> builtCardTasksCodes = builtCard.group.tasks.articleCode
		Card replacedCard = dbOrderCards.find {
			List<Integer> dayOrderCardTasksCodes = it.group.tasks.articleCode
			List<Integer> difference = builtCardTasksCodes.size() > dayOrderCardTasksCodes.size() ?
											builtCardTasksCodes - dayOrderCardTasksCodes :
											dayOrderCardTasksCodes - builtCardTasksCodes

			/* Una diferencia de uno entre las tareas implica que sólo se ha añadido o quitado una. Es decir, que la
			*  agrupación ha cambiado poco. En ese caso, se toma la ficha como referencia para actualizar únicamente su
			*  grupo y duración. */
			return difference && difference.size() <= Math.max(builtCardTasksCodes.size(), dayOrderCardTasksCodes.size()) * 0.5
		}
		return replacedCard
	}

	/**
	 * Check if a card order info has been updated from JPDV
	 * @param builtCard Built card based on orders info
	 * @param dbCard Card of the day, already saved in DB
	 * @return boolean
	 */
	static Map<String, Object> checkUpdatedOrderInfo(Card dbCard, Card builtCard) {
		Map<String, Object> orderDifferences = ((builtCard.order.properties + builtCard.vehicle.properties) -
			(dbCard.order.properties + dbCard.vehicle.properties)) as Map<String, Object>
		return orderDifferences
	}

	/**
	 * Update card object with new built card order info
	 * @param builtCard Newly built card
	 * @param dbCard Already saved card
	 * @return Updated card
	 */
	static Card updateCardOrderInfo(Card dbCard, Card builtCard) {
		dbCard.order = builtCard.order
		dbCard.vehicle = builtCard.vehicle
		return dbCard
	}

	/**
	 * Update card object with new built card group info
	 * @param builtCard Newly built card
	 * @param dbCard Already saved card
	 * @return Updated card
	 */
	static Card updateCardGroupInfo(Card dbCard, Card builtCard) {
		dbCard.group = builtCard.group
		dbCard.duration = builtCard.duration
		return dbCard
	}

	/**
	 * Actualiza la información de posición de la ficha que va a reemplazar a otra
	 * @param dbCard Ficha que va a ser reemplazada
	 * @param builtCard Ficha que va a reemplazar a la existente
	 * @return Ficha actualizada
	 */
	static Card updateReplacedCard(Card dbCard, Card builtCard) {
		builtCard.day = dbCard.day
		builtCard.mechanicCode = dbCard.mechanicCode
		builtCard.start = dbCard.start
		return builtCard
	}

	/**
	 * Actualiza la información de posición de la ficha que va a reemplazar a otra
	 * @param dbCard Ficha que va a ser reemplazada
	 * @param builtCard Ficha que va a reemplazar a la existente
	 * @return Ficha actualizada
	 */
	static Card updateResetCard(Card dbCard) {
		dbCard.day = null
		dbCard.mechanicCode = null
		dbCard.start = null
		dbCard.line = null
		dbCard.status = Card.Status.DEFAULT
		return dbCard
	}

	/**
	 * Get deleted cards with updated dateDeleted
	 * @param orders List of orders
	 * @param builtCards List of built cards
	 * @return List of updated cards
	 */
	static List<Card> getDeletedCards(List<Order> orders, List<Card> dbCards, List<Card> builtCards) {
		List<Card> cardsToDelete = getDeletedOrdersCards(orders, dbCards)
		cardsToDelete += getUpdatedGroupDeletedCards(dbCards, builtCards)
		List<Card> deletedCards = cardsToDelete.collect { deleteCard(it) }
		return deletedCards
	}

	/**
	 * Get cards to delete because order no longer exists
	 * @param orders List of orders
	 * @param builtCards Cards saved for day
	 * @return List of cards to delete
	 */
	static List<Card> getDeletedOrdersCards(List<Order> orders, List<Card> dbCards) {
		List<Card> cardsToDelete = dbCards.findAll {
			!(it.order.number in orders.number) && it.type != Card.CardType.AUXILIARY
		}
		return cardsToDelete
	}

	/**
	 * Get cards to delete because order tasks changed and its group is no longer necessary
	 * @param orders List of orders
	 * @param builtCards Cards built based on orders info
	 * @return List of cards to delete
	 */
	static List<Card> getUpdatedGroupDeletedCards(List<Card> dbCards, List<Card> builtCards) {
		List<Card> cardsToDelete = dbCards.findAll { Card dbCard ->
			List<Card> builtOrderCards = builtCards.findAll { it.order.number == dbCard.order.number }
			Card orderAndGroupCard = builtOrderCards.find { it.group.code == dbCard.group.code }
			return builtOrderCards && !orderAndGroupCard
		}
		return cardsToDelete
	}

	/**
	 * Delete card (set dateDeleted)
	 * @param card Card
	 * @return Updated card
	 */
	static Card deleteCard(Card card) {
		card.dateDeleted = LocalDateTime.now()
		return card
	}

	static void fixSameCardsDeletedInfo(List<Card> sameCards, List<Card> deletedCards) {
		sameCards.each { Card card ->
			Card linkedPreviousDeletedCard = card.linkedPrevious ? deletedCards.find { it == card.linkedPrevious } : null
			Card linkedNextDeletedCard = card.linkedNext ? deletedCards.find { it == card.linkedNext } : null
			if (linkedPreviousDeletedCard) {
				card.linkedPrevious = null
			}
			if (linkedNextDeletedCard) {
				card.linkedNext = null
			}
		}
	}

	// endregion

	// region Save cards

	/**
	 * Save cards in database, wether creating new rows or updating existing ones
	 * @param updateCards Object with cars to create, update or delete (update dateDeleted)
	 */
	void saveCards(UpdateCards updateCards) {
		if (updateCards.newCards) {
			/* Las relaciones entre fichas se asignan a la hora de guardar en BD, ya que aquí todavía no tienen un id.
			*  Por lo tanto, en la respuesta ya figura la información completa */
			updateCards.newCards = panelDatabaseClient.createCards(
				"", updateCards.newCards.collect { it.properties }, true
			)
		}
		if (updateCards.newReplace) {
			updateCards.newReplace = panelDatabaseClient.createCards(
				"", updateCards.newReplace.collect { it.properties }, true
			)
		}
		if (updateCards.getUpdate()) {
			panelDatabaseClient.updateCards(updateCards.getUpdate())
		}
		if (updateCards.deleted) {
			panelDatabaseClient.deleteCards("", updateCards.deleted.collect { it.properties })
		}
	}

	// endregion

	// region Appointment days

	List<AppointmentDay> syncAppointmentDays(
		List<LocalDate> days,
		List<AppointmentDay> existentAppointmentDays,
		List<AppointmentType> appointmentTypes,
		List<Card> cards
	) {
		List<AppointmentDay> appointmentDays = days.collect { new AppointmentDay(it, appointmentTypes) }
		fillAppointmentDays(appointmentDays, existentAppointmentDays, cards)
		UpdateAppointmentDays updateAppointmentDays = findUpdateAppointmentDays(existentAppointmentDays, appointmentDays)

		if (updateAppointmentDays.created) {
			panelDatabaseClient.createAppointmentDays("", updateAppointmentDays.created)
		}
		if (updateAppointmentDays.updated) {
			panelDatabaseClient.updateAppointmentDays("", updateAppointmentDays.updated)
		}
		return appointmentDays
	}

	static List<AppointmentDay> fillAppointmentDays(
		List<AppointmentDay> appointmentDays,
		List<AppointmentDay> existentAppointmentDays,
		List<Card> cards
	) {
		/* Se recorre un bucle aparte para rellenar el campo max, que no depende del número de órdenes sino de lo que
		*  se haya introducido desde panel */
		appointmentDays.each { AppointmentDay appointmentDay ->
			AppointmentDay existent = existentAppointmentDays.find { it.day == appointmentDay.day }
			if (existent) {
				appointmentDay.values.each { AppointmentTypeValues values ->
					values.max = existent.values.find { it.appointmentType.code == values.appointmentType.code }.max
				}
			}
		}
		cards.groupBy { it.order.number }.each { int orderNumber, List<Card> orderCards ->
			LocalDate day = orderCards[0].order.day
			AppointmentDay appointmentDay = appointmentDays.find { it.day == day }
			if (appointmentDay) {
				List<AppointmentTypeCode> appointmentTypeCodes = findOrderCardsAppointmentTypes(orderCards)
				appointmentTypeCodes.each { AppointmentTypeCode code ->
					fillScheduleTypeAppointmentValues(
						appointmentDay.values.find { it.appointmentType.code == code },
						orderCards[0].order.created,
						(int) orderCards.duration.sum(),
						1
					)
				}
			}
		}
		return appointmentDays
	}

	static UpdateAppointmentDays findUpdateAppointmentDays(
		List<AppointmentDay> existentAppointmentDays, List<AppointmentDay> appointmentDays
	) {
		UpdateAppointmentDays updateAppointmentDays = new UpdateAppointmentDays()
		appointmentDays.each { AppointmentDay appointmentDay ->
			AppointmentDay existentAppointmentDay = existentAppointmentDays.find { it.day == appointmentDay.day }
			if (existentAppointmentDay) {
				if (checkUpdatedAppointmentDay(existentAppointmentDay, appointmentDay)) {
					updateAppointmentDays.updated << appointmentDay
				}
			} else {
				updateAppointmentDays.created << appointmentDay
			}
		}
		return updateAppointmentDays
	}

	static boolean checkUpdatedAppointmentDay(AppointmentDay existent, AppointmentDay appointmentDay) {
		return existent.values.find { AppointmentTypeValues existentValues ->
			AppointmentTypeValues values = appointmentDay.values.find {
				it.appointmentType.code == existentValues.appointmentType.code
			}
			return existentValues.morning != values.morning || existentValues.afternoon != values.afternoon
		}
	}

	/**
	 * Devuelve los tipos de cita asociados a una orden
	 * @param cards Fichas de la orden
	 * @return Lista de códigos de cita
	 */
	static List<AppointmentTypeCode> findOrderCardsAppointmentTypes(List<Card> cards) {
		/* Con que haya una sóla prestación de TP, toda la cita es de TP */
		if (cards.find { it.group.appointmentType.code == AppointmentTypeCode.TP }) {
			return [AppointmentTypeCode.TP]
		} else {
			/* Si no hay TP, pero se encuentra una prestación de INT, figura tanto en INT como en RAP */
			if (cards.find { it.group.appointmentType.code == AppointmentTypeCode.INT }) {
				return [AppointmentTypeCode.RAP, AppointmentTypeCode.INT]
			} else {
				return [AppointmentTypeCode.RAP]
			}
		}
	}

	static boolean checkMorningType(LocalTime start, int duration) {
		LocalTime threshold = LocalTime.of(15, 0)
		long startDiff = start.until(threshold, ChronoUnit.MINUTES)
		long endDiff = threshold.until(start.plusMinutes(duration), ChronoUnit.MINUTES)
		return startDiff > endDiff
	}

	static void fillScheduleTypeAppointmentValues(
		AppointmentTypeValues values, LocalTime orderStart, int orderDuration, int value
	) {
		boolean morningAppointment = checkMorningType(orderStart, orderDuration)
		if (morningAppointment) {
			values.morning += value
		} else {
			values.afternoon += value
		}
		values.total += value
	}

	// endregion

}
