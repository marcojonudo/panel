package panel.services

import groovy.transform.CompileStatic
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import panel.clients.cubo.CuboDatabaseClient
import panel.clients.fviberi.FviberiDatabaseClient
import panel.clients.panel.PanelDatabaseClient
import panel.clients.skills.SkillsDatabaseClient
import panel.pogos.CompleteInfo
import panel.pogos.SyncOrdersSemaphore
import panel.pogos.UpdateAppointmentDays
import panel.pogos.UpdateCards
import panel.utils.Constants
import utils.pogos.Schedule
import utils.pogos.fviberi.Article
import utils.pogos.fviberi.Order
import utils.pogos.panel.*
import utils.pogos.schedules.EmployeeSchedule
import utils.pogos.skills.Skill

import javax.inject.Inject
import javax.inject.Singleton
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime

@Singleton
@CompileStatic
class PanelService {

	private static final Logger LOG = LoggerFactory.getLogger(PanelService)

	@Inject private PanelDatabaseClient panelDatabaseClient
	@Inject private FviberiDatabaseClient fviberiDatabaseClient
	@Inject private SkillsDatabaseClient skillsDatabaseClient
	@Inject private CuboDatabaseClient cuboDatabaseClient

	static LocalDate lastScheduleDay

	CompleteInfo getPanelInfo(LocalDate day = LocalDate.now()) {
		List<JobLineType> jobLineTypes = panelDatabaseClient.getJobLineTypes()
		List<Skill> skills = skillsDatabaseClient.getMechanicsSkills()
		List<AppointmentType> appointmentTypes = panelDatabaseClient.getAppointmentTypes()
		List<AppointmentDay> appointmentDays = panelDatabaseClient.getAppointmentDays(day)
		Map<String, List<EmployeeSchedule>> daysMechanics = getDaysMechanics(LocalDate.now())

		deletePendingCards(day)

		/* El último día para obtener órdenes es el último día que tengan horarios definidos. No tiene sentido que
		*  tengan en la cinta citas de días que ni siquiera pueden asignar */
		lastScheduleDay = LocalDate.parse(daysMechanics.keySet().max())
		UpdateCards updateCards = syncJpdvOrders(day, lastScheduleDay)

		/* Una vez cargados los horarios definidos y las nuevas fichas para crear, se sincroniza la información de
		*  citas. Para cada día, se crean los registros de contador de cita asociadaso, inicializándolos con el número
		*  de fichas correspondiente */
		appointmentDays = syncAppointmentDays(
				daysMechanics,
				appointmentDays,
				appointmentTypes.findAll { it.counter },
				updateCards.newCards
		)
		return new CompleteInfo(
				daysMechanics,
				skills,
				jobLineTypes,
				appointmentTypes,
				appointmentDays,
				updateCards.getAll() + updateCards.auxiliaryCards
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
	Map<String, List<EmployeeSchedule>> getDaysMechanics(LocalDate from) {
		List<EmployeeSchedule> mechanics = cuboDatabaseClient.getMechanics(from, null, true)
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

	UpdateCards syncJpdvOrders(LocalDate from, LocalDate to) {
		UpdateCards updateCards = null
		if (SyncOrdersSemaphore.trySyncOrders()) {
			try {
				/* Se obtiene una lista con las órdenes que se deben reflejar en el panel (en función del estado) */
				List<Order> orders = fviberiDatabaseClient.getOrders(Constants.ORDERS_QUERY_STATES, to)
				/* Se obtiene una lista de fichas del día para comparar con las órdenes y sincronizarlas en la BD */
				List<Card> dbCards = panelDatabaseClient.getCards(from, null)
				List<Card> auxiliaryCards = dbCards.findAll { checkAuxiliaryCard(it) }
				List<Card> notAuxiliaryCards = handleOrdersCards(orders, dbCards.findAll { !checkAuxiliaryCard(it) })

				updateCards = syncOrders(orders, notAuxiliaryCards)
				updateCards.auxiliaryCards = auxiliaryCards

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

	static UpdateCards getCardsToUpdate(List<Order> orders, List<Card> dbCards, List<Card> builtCards) {
		/* Se obtienen las órdenes cuyas fichas deben ser creadas (número de orden no existe en las fichas actuales) */
		UpdateCards updateCards = getNewOrUpdatedCards(dbCards, builtCards)
		updateCards.deletedCards = getDeletedCards(orders, dbCards, builtCards)
		fixSameCardsDeletedInfo(updateCards.sameCards, updateCards.deletedCards)

		return updateCards
	}

	/**
	 * Get cards to create from existent orders, or cards to update
	 * @param dbCards List of cards of the day
	 * @param builtCards Cards built based on orders info
	 * @return UpdateCardsInfo with newCards and cardsToUpdate
	 */
	static UpdateCards getNewOrUpdatedCards(List<Card> dbCards, List<Card> builtCards) {
		UpdateCards updateCards = new UpdateCards()
		builtCards.each { Card builtCard ->
			List<Card> dayOrderCards = dbCards.findAll { it.order.number == builtCard.order.number }

			if (dayOrderCards) {
				boolean handledCards = handleExistentGroupCard(dayOrderCards, builtCard, updateCards)
				if (!handledCards) {
					/* Si el grupo de builtCard no coincide con ninguno de dayOrderCards, se comprueba si ha reemplazado
					 * a alguno existente o si es una ficha completamente nueva */
					handleReplacedGroupCard(dayOrderCards, builtCard, updateCards)
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
	 * Handle existent group new card. Update updatedCards list if builtCard has been updated from JPDV
	 * @param dayOrderCards Saved day order cards
	 * @param builtCard Built card
	 * @param updatedCards List of updated cards
	 * @return boolean
	 */
	static boolean handleExistentGroupCard(List<Card> dayOrderCards, Card builtCard, UpdateCards updateCards) {
		/* Se buscan todas las fichas, y no sólo una, ya que puede haber alguna dividida */
		List<Card> dayGroupOrderCards = dayOrderCards.findAll { it.group.code == builtCard.group.code }
		if (dayGroupOrderCards) {
			/* El grupo sigue siendo el mismo, por lo que se comprueba si ha cambiado alguna propiedad de la orden.
			 * Se obtiene el elemento 0, ya que si la ficha estaba dividida, las propiedades de la orden son las mismas
			 * en todas ellas */
			if (checkUpdatedOrderInfo(dayGroupOrderCards[0], builtCard)) {
				updateCards.updatedCards += dayGroupOrderCards.collect { updateCardOrderInfo(it, builtCard) }
			} else {
				/* Fichas que no han sufrido ningún cambio, pero deben devolverse para que se carguen en panel */
				updateCards.sameCards += dayGroupOrderCards
			}
			return true
		}
		return false
	}

	/**
	 * Handle replace group new card. Update updatedCards list if with new built card, or update an existent one
	 * @param dayOrderCards Saved day order cards
	 * @param builtCard Built card
	 * @param updatedCards List of updated cards
	 */
	static void handleReplacedGroupCard(List<Card> dayOrderCards, Card builtCard, UpdateCards updateCards) {
		Card replacedCard = findReplacedCard(dayOrderCards, builtCard)
		if (replacedCard) {
			if (checkUpdatedOrderInfo(replacedCard, builtCard)) {
				updateCards.updatedCards << updateCardOrderInfo(updateCardGroupInfo(replacedCard, builtCard), builtCard)
			} else {
				updateCards.updatedCards << updateCardGroupInfo(replacedCard, builtCard)
			}
		} else {
			updateCards.newCards << builtCard
		}
	}

	/**
	 * Find the replaced existent card based on its group tasks. If groups are not the same, it is necessary to check
	 * the tasks to know if a card is replacing another, or if it a completely new card
	 * @param dayOrderCards Saved order cards
	 * @param builtCard Built card
	 * @return Replaced card
	 */
	static Card findReplacedCard(List<Card> dayOrderCards, Card builtCard) {
		List<Integer> builtCardTasksCodes = builtCard.group.tasks.articleCode
		Card replacedCard = dayOrderCards.find {
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
	 * @param dayCard Card of the day, already saved in DB
	 * @return boolean
	 */
	static boolean checkUpdatedOrderInfo(Card dayCard, Card builtCard) {
		Map orderDifferences = (builtCard.order.properties + builtCard.vehicle.properties) -
				(dayCard.order.properties + dayCard.vehicle.properties)
		return orderDifferences.size() > 0
	}

	/**
	 * Update card object with new built card order info
	 * @param builtCard Newly built card
	 * @param dayCard Already saved card
	 * @return Updated card
	 */
	static Card updateCardOrderInfo(Card dayCard, Card builtCard) {
		dayCard.order = builtCard.order
		dayCard.vehicle = builtCard.vehicle
		return dayCard
	}

	/**
	 * Update card object with new built card group info
	 * @param builtCard Newly built card
	 * @param dayCard Already saved card
	 * @return Updated card
	 */
	static Card updateCardGroupInfo(Card dayCard, Card builtCard) {
		dayCard.group = builtCard.group
		dayCard.duration = builtCard.duration
		return dayCard
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
		List<Card> cardsToDelete = dbCards.findAll { Card dayCard ->
			List<Card> builtOrderCards = builtCards.findAll { it.order.number == dayCard.order.number }
			Card orderAndGroupCard = builtOrderCards.find { it.group.code == dayCard.group.code }
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
			updateCards.newCards = panelDatabaseClient.createCards("", updateCards.newCards.collect { it.properties }, true)
		}
		if (updateCards.updatedCards) {
			panelDatabaseClient.updateCards(updateCards.updatedCards)
		}
		if (updateCards.deletedCards) {
			panelDatabaseClient.deleteCards("", updateCards.deletedCards.collect { it.properties })
		}
	}

	/**
	 * Relate linked cards IDs once the cards where saved in DB
	 * @param cards List of recently created cards
	 */
	static void relateCards(List<Card> cards) {
		cards.groupBy { it.order.number }.each { int orderNumber, List<Card> orderCards ->
			orderCards.eachWithIndex { Card card, int i ->
				if (i != 0) {
					card.linkedPrevious = orderCards[i-1]
				}
				if (i != orderCards.size() - 1) {
					card.linkedNext = orderCards[i+1]
				}
			}
		}
	}

	// endregion

	// region Appointment days

	List<AppointmentDay> syncAppointmentDays(
			Map<String, List<EmployeeSchedule>> daysMechanics,
			List<AppointmentDay> appointmentDays,
			List<AppointmentType> appointmentTypes,
			List<Card> createdCards
	) {
		/* Se sincronizan los horarios con las citas */
		UpdateAppointmentDays schedulesUpdateInfo = syncSchedulesAppointmentDays(
				daysMechanics,
				appointmentDays,
				appointmentTypes,
				createdCards
		)
		/* Se sincronizan las fichas con las citas. Se hace por si alguna ficha tiene como día de la orden
		*  uno superior al último horario definido */
		UpdateAppointmentDays cardsUpdateInfo = syncCardsAppointmentDays(
				daysMechanics,
				appointmentDays,
				appointmentTypes,
				createdCards
		)

		if (schedulesUpdateInfo.created || cardsUpdateInfo.created) {
			panelDatabaseClient.createAppointmentDaysTotal(
					"",
					schedulesUpdateInfo.created + cardsUpdateInfo.created
			)
		}
		if (schedulesUpdateInfo.updated || cardsUpdateInfo.updated) {
			panelDatabaseClient.updateAppointmentDaysTotal(
					"",
					schedulesUpdateInfo.updated + cardsUpdateInfo.updated
			)
		}
		return appointmentDays + schedulesUpdateInfo.created + cardsUpdateInfo.created
	}

	static UpdateAppointmentDays syncSchedulesAppointmentDays(
			Map<String, List<EmployeeSchedule>> daysMechanics,
			List<AppointmentDay> appointmentDays,
			List<AppointmentType> appointmentTypes,
			List<Card> createdCards
	) {
		UpdateAppointmentDays updateInfo = new UpdateAppointmentDays()
		/* Sólo se tienen en cuenta aquellos horarios con día (los horarios fijos de taller y tienda, cuyo day es null,
		*  se omiten) */
		daysMechanics.findAll { it.key }.each {
			LocalDate day = LocalDate.parse(it.key)
			/* Se obtienen los appointmentDay para cada tipo de cita para el día en concreto */
			List<AppointmentDay> appointmentDayTypes = appointmentDays.findAll { it.day == day }
			/* Se obtienen las fichas cuya orden figura en el día en concreto */
			List<Card> dayOrderCards = createdCards.findAll { it.order.day == day }
			/* Si existen appointmentDay para el día, significa que se habían creado con anterioridad, y por tanto
			*  sólo es necesario comprobar si alguna de las fichas es de este día para sumar al total */
			if (appointmentDayTypes) {
				if (dayOrderCards) {
					updateInfo.updated += updateAppointmentDays(appointmentDayTypes, dayOrderCards)
				}
			} else {
				updateInfo.created += createAppointmentDays(day, appointmentTypes, dayOrderCards)
			}
		}

		return updateInfo
	}

	static UpdateAppointmentDays syncCardsAppointmentDays(
			Map<String, List<EmployeeSchedule>> daysMechanics,
			List<AppointmentDay> appointmentDays,
			List<AppointmentType> appointmentTypes,
			List<Card> createdCards
	) {
		UpdateAppointmentDays updateInfo = new UpdateAppointmentDays()

		LocalDate maxDay = daysMechanics.collect { it.value[0] }.day.max()
		List<Card> futureScheduleCards = createdCards.findAll { it.order.day > maxDay }
		futureScheduleCards.groupBy { it.order.day }.each { LocalDate orderDay, List<Card> cards ->
			List<AppointmentDay> appointmentDayTypes = appointmentDays.findAll { it.day == orderDay }
			if (appointmentDayTypes) {
				updateInfo.updated += updateAppointmentDays(appointmentDayTypes, cards)
			} else {
				updateInfo.created += createAppointmentDays(orderDay, appointmentTypes, cards)
			}
		}
		return updateInfo
	}

	static List<AppointmentDay> updateAppointmentDays(List<AppointmentDay> appointmentDayTypes, List<Card> dayOrderCards) {
		List<AppointmentDay> updatedAppointmentDayTypes = []
		appointmentDayTypes.each { AppointmentDay appointmentDay ->
			List<Card> typeCards = dayOrderCards.findAll {
				it.group.appointmentType.code == appointmentDay.appointmentType.code
			}
			if (typeCards) {
				appointmentDay.total += typeCards.size()
				updatedAppointmentDayTypes << appointmentDay
			}
		}
		return updatedAppointmentDayTypes
	}

	static List<AppointmentDay> createAppointmentDays(
			LocalDate day,
			List<AppointmentType> appointmentTypes,
			List<Card> dayOrderCards
	) {
		List<AppointmentDay> createdAppointmentDays = []
		appointmentTypes.each { AppointmentType appointmentType ->
			List<Card> typeCards = dayOrderCards.findAll {
				it.group.appointmentType.code == appointmentType.code
			}
			createdAppointmentDays << new AppointmentDay(
					day: day,
					appointmentType: appointmentType,
					total: typeCards.size()
			)
		}
		return createdAppointmentDays
	}

	// endregion

}
