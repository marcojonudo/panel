package panel.services

import grails.gorm.transactions.Transactional
import groovy.transform.CompileStatic
import jakarta.inject.Inject
import jakarta.inject.Singleton
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import panel.domains.fviberi.Order
import panel.domains.fviberi.OrderLine
import panel.domains.panel.*
import panel.domains.panel.AppointmentType.Code
import panel.domains.schedules.Centre
import panel.domains.schedules.EmployeeSchedule
import panel.domains.schedules.JobPositionGroup
import panel.domains.skills.Skill
import panel.domains.skills.SkillEmployee
import panel.pogos.appointmentDays.UpdateAppointmentDays
import panel.pogos.cards.GroupUnits
import panel.pogos.firstLoad.CompleteInfo
import panel.pogos.firstLoad.SyncOrdersSemaphore
import panel.pogos.firstLoad.UpdateCards
import panel.pogos.ifv.getEmployees.IfvEmployee
import panel.pogos.logs.Log
import panel.services.data.fviberi.OrderDataService
import panel.services.data.panel.*
import panel.services.data.schedules.CentreDataService
import panel.services.data.schedules.EmployeeScheduleDataService
import panel.services.data.skills.SkillDataService
import panel.utils.Builder
import panel.utils.Constants

import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime
import java.time.temporal.ChronoUnit

@Singleton
@CompileStatic
class PanelService {

	private static final Logger LOG = LoggerFactory.getLogger(PanelService)

	@Inject private CentreDataService centreDataService
	@Inject private IfvService ifvService
	@Inject private SkillsService skillsService
	@Inject private JobLineTypeDataService jobLineTypeDataService
	@Inject private AppointmentTypeDataService appointmentTypeDataService
	@Inject private AppointmentDayDataService appointmentDayDataService
	@Inject private CardDataService cardDataService
	@Inject private TaskDataService taskDataService
	@Inject private GroupDurationDataService groupDurationDataService
	@Inject private SkillDataService skillDataService
	@Inject private EmployeeScheduleDataService employeeScheduleDataService
	@Inject private OrderDataService orderHeaderDataService
	@Inject private MechanicPanelInfoDataService mechanicInfoDataService
	@Inject private MechanicAppointmentDataService mechanicAppointmentDataService

	static LocalDate lastScheduleDay

	@Transactional(connection = Constants.DataSource.SCHEDULES)
	CompleteInfo getPanelInfo(LocalDate from, LocalDate to) {
		LocalDate today = LocalDate.now()

		Centre centre = centreDataService.find()
		List<IfvEmployee> employees = []//ifvService.getEmployees(today, today, centre.code)

		List<JobLineType> jobLineTypes = jobLineTypeDataService.findAll()

		List<AppointmentType> appointmentTypes = appointmentTypeDataService.findAll()
		List<AppointmentDay> appointmentDays = appointmentDayDataService.findAll(from)

		List<EmployeeSchedule> mechanics = findMechanics(from, to)

		List<Skill> skills = skillDataService.findAll(JobPositionGroup.Code.GARAGE)
		List<SkillEmployee> skillEmployees = skillsService.findSkillEmployees(
			mechanics.unique(false) { it.code }, skills, today.withDayOfMonth(1)
		)

		/* El último día para obtener órdenes es el último día que tengan horarios definidos. No tiene sentido que
		*  tengan en la cinta citas de días que ni siquiera pueden asignar */
		UpdateCards updateCards = syncJpdvOrders(today, lastScheduleDay, appointmentDays, appointmentTypes)
		List<Card> cards = updateCards.getAll().findAll { !it.day || (it.day >= from && it.day <= to) }

		return new CompleteInfo(
			mechanics,
			employees,
			skills,
			skillEmployees,
			jobLineTypes,
			appointmentTypes,
			mechanics ? mechanics[0].day : null,
			lastScheduleDay,
			updateCards.appointmentDays ?: appointmentDays,
			cards + updateCards.avoidSync
		)
	}

	// region Mechanics

	/**
	 * Obtiene los mecánicos para cada día y carga su posición si todavía no está definida
	 * @param from Fecha desde
	 * @param to Fecha hasta
	 * @return Lista de mecánicos
	 */
	List<EmployeeSchedule> findMechanics(LocalDate from, LocalDate to) {
		List<EmployeeSchedule> mechanics = employeeScheduleDataService.findAll(from, to, JobPositionGroup.Code.GARAGE)
		mechanics.each {
			it.mechanicPanelInfo = findMechanicPanelInfo(it, mechanics)
			it.appointments = mechanicAppointmentDataService.findAll(it.id)
		}
		lastScheduleDay = employeeScheduleDataService.findEmployeeScheduleDay([sort: 'day', order: 'desc', max: 1])
		return mechanics
	}

	/**
	 * Encuentra la información de panel del mecánico
	 * @param mechanic Mecánico
	 * @param mechanics Lista de mecánicos para comprobar su posición en panel
	 * @return Información de panel del mecánico
	 */
	MechanicPanelInfo findMechanicPanelInfo(EmployeeSchedule mechanic, List<EmployeeSchedule> mechanics) {
		String lastPosition = mechanics.findAll { it.day == mechanic.day }.mechanicPanelInfo.position.max()
		String nextPosition = lastPosition ?
			String.valueOf((lastPosition.charAt(0) + 1) as char) : Constants.FIRST_MECHANIC_POSITION
		return mechanicInfoDataService.find(mechanic.id) ?: mechanicInfoDataService.save(mechanic.id, nextPosition)
	}

//	/**
//	 * Integra los mecánicos sin día (líneas de taller y tienda) y convierte la lista de mecánicos en un mapa
//	 * @param mechanics Lista de mecánicos
//	 * @return Mapa con día y mecánicos
//	 */
//	static Map<String, List<EmployeeSchedule>> integrateFixedMechanics(List<EmployeeSchedule> mechanics) {
//		boolean existentMechanics = mechanics.find { it.day }
//		Map<String, List<EmployeeSchedule>> daysMechanics = [:]
//
//		/* Sólo se integran las líneas de taller y tienda si existen otros mecánicos. Si no, no tiene sentido hacerlo,
//		*  ya que el horario de las primeras se basa en el de los segundos */
//		if (existentMechanics) {
//			LocalDate today = LocalDate.now()
//            List<EmployeeSchedule> todayMechanics = mechanics.findAll { it.day == today }
//            if (!todayMechanics) {
//                mechanics = mechanics.findAll { it.day }
//            }
//			mechanics.each {
//				if (!it.day) {
//					it.intervals = [findThresholdSchedule(todayMechanics)].toSet()
//					it.day = today
//				}
//				if (!daysMechanics[it.day.toString()]) {
//					daysMechanics[it.day.toString()] = []
//				}
//				daysMechanics[it.day.toString()] << it
//			}
//		}
//		return daysMechanics
//	}

//	/**
//	 * Obtiene un horario con la entrada más temprana y la salida más tardía
//	 * @param mechanics Lista de mecánicos
//	 * @return Intervalo de horario
//	 */
//	static ScheduleInterval findThresholdSchedule(List<EmployeeSchedule> mechanics) {
//		List<ScheduleInterval> intervals = (List<ScheduleInterval>) mechanics.intervals.flatten()
//		LocalTime minStart = intervals.start.min()
//		LocalTime maxEnd = intervals.end.max()
//
//		return new ScheduleInterval(start: minStart, end: maxEnd)
//	}

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
				List<Order> orders = orderHeaderDataService.findAll(
					Constants.ORDERS_QUERY_STATES, lastScheduleDay
				).sort { it.number }
				/* Se obtiene una lista de fichas del día para comparar con las órdenes y sincronizarlas en la BD */
				List<Card> dbCards = cardDataService.findAllFrom(from)
				List<Card> avoidSyncCards = dbCards.findAll { checkAvoidSync(it) }
				List<Card> syncCards = fillCardsOrderLines(dbCards.findAll { !checkAvoidSync(it) }, orders)

				updateCards = syncOrders(orders, syncCards)
				updateCards.avoidSync = avoidSyncCards

				List<LocalDate> days = []
				for (LocalDate day = from; day <= lastScheduleDay; day = day.plusDays(1)) {
					days << day
				}
				updateCards.appointmentDays = syncAppointmentDays(
					days,
					appointmentDays ?: appointmentDayDataService.findAll(from),
					(appointmentTypes ?: appointmentTypeDataService.findAll()).findAll { it.counter },
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

	/**
	 * Comprueba si la ficha debe sincronizarse con JPDV
	 * @param card Ficha
	 * @return booleano
	 */
	static boolean checkAvoidSync(Card card) {
		/* No se sincronizan con JPDV las plantillas de las fichas auxiliares, ni las fichas de eCommerce cuyo status
		*  no sea ECOMMERCE (si el status es CONFIRMED, se debe esperar a que se sustituya) */
		return card.type == Card.CardType.AUXILIARY && card.status != Card.Status.ECOMMERCE
	}

	/**
	 * Se rellena la lista de fichas con información sobre la orden
	 * @param cards Lista de fichas
	 * @param orders Lista de ordenes
	 * @return
	 */
	static List<Card> fillCardsOrderLines(List<Card> cards, List<Order> orders) {
		cards.each { Card card ->
			Order order = orders.find { it.number == card.order.number }
			/* Las fichas auxiliares no tienen orden */
			if (order) {
				card.order.lines = filterOrderLines(order)
			}
		}
		return cards
	}

	UpdateCards findDbUpdateCards(LocalDate from) {
		List<Card> dbCards = cardDataService.findAllFrom(from)
		List<Card> auxiliaryCards = dbCards.findAll { checkAvoidSync(it) }
		return new UpdateCards(dbCards, auxiliaryCards)
	}

	/**
	 * Sincroniza las ordenes de JPDV con las fichas existentes en panel
	 * @param orders Lista de ordenes
	 * @return Lista de fichas de base de datos
	 */
	UpdateCards syncOrders(List<Order> orders, List<Card> dbCards) {
		UpdateCards ordersUpdateCards = new UpdateCards()
		orders.each {
			List<GroupUnits> groupsUnits = findGroupUnits(it)
			if (groupsUnits) {
				List<GroupUnits> groupsDurations = groupDurationDataService.findAll(groupsUnits)
				List<Card> orderCards = buildOrderCards(it, groupsDurations)

				boolean replaceOrderCards = checkReplaceOrderCards(orderCards)
				UpdateCards updateCards = null
				if (replaceOrderCards) {
					updateCards = handleCardsReplacement(dbCards, orderCards)
				}
				updateCards = updateCards ?: handleCardsUpdate(dbCards, orderCards)
				ordersUpdateCards.add(updateCards)
			}
		}
		UpdateCards deleteUpdateCards = handleCardsDeletion(
			orders, dbCards, ordersUpdateCards.getAll(), ordersUpdateCards.same
		)
		ordersUpdateCards.add(deleteUpdateCards)
		return ordersUpdateCards
	}

	/**
	 * Encuentra los grupos y unidades asociados a una orden
	 * @param order Orden
	 * @return Lista de grupos y unidades asociados
	 */
	List<GroupUnits> findGroupUnits(Order order) {
		/* Se filtran las líneas para obtener sólo aquellas cuyo artículo se haya encontrado en BD */
		List<OrderLine> orderLines = filterOrderLines(order)

		/* Se obtienen los artículos sin el primer dígito, que no identifica el propio artículo */
		List<Integer> articleCodes = orderLines.article.code.collect { findUnitaryArticleCode(it) }
		List<Task> orderTasks = taskDataService.findAll(articleCodes)
		List<GroupUnits> groupsUnits = findOrderGroups(order, orderLines, orderTasks)
		return groupsUnits
	}

	/**
	 * Filtra las líneas de la orden cuyo artículo se haya encontrado en BD (de no ser así, el objeto Article dará
	 * una LazyInitializationException al intentar acceder él)
	 * @param order Orden
	 * @return Lista de líneas de la orden
	 */
	static List<OrderLine> filterOrderLines(Order order) {
		List<OrderLine> filteredLines = []
		order.lines.each {
			try {
				if (it.article.labour == "S") {
					filteredLines << it
				}
			} catch (ignored) {
				LOG.info(new Log([message: Constants.Message.NOT_FOUND_ARTICLE, order: order.number, line: it.line]).toString())
			}
		}
		return filteredLines
	}

	/**
	 * Se elimina el primer dígito del código de artículo
	 * @param code Código de artículo
	 * @return Código de artículo sin el primer dígito
	 */
	static int findUnitaryArticleCode(int code) {
		return (code as String)[1..-1] as int
	}

	/**
	 * Get order groups and units based on its articles
	 * @param order Order from which to get the groups
	 * @param tasks List of all tasks
	 * @return List of GroupUnits
	 */
	static List<GroupUnits> findOrderGroups(Order order, List<OrderLine> orderLines, List<Task> orderTasks) {
		/* Se filtran las tareas absorbibles */
		List<Task> filteredOrderTasks = filterAbsorbableTasks(orderTasks)

		List<Task> processedTasks = []
		List<GroupUnits> selectedGroupsInfo = []
		filteredOrderTasks.each { Task task ->
			boolean alreadyProcessedTask = processedTasks.find { it.articleCode == task.articleCode }
			if (!alreadyProcessedTask) {
				/* Se obtienen los grupos cuyas tareas todavía no han sido procesadas */
				Set<Group> possibleGroups = task.groups.findAll {
					!it.tasks.find { it.articleCode in processedTasks.articleCode }
				}
				Group selectedGroup = findSelectedGroup(possibleGroups, filteredOrderTasks)
				if (selectedGroup) {
					selectedGroupsInfo << new GroupUnits(
						group: selectedGroup,
						units: getOrderGroupUnits(orderLines, selectedGroup)
					)
					processedTasks += selectedGroup.tasks
				} else {
					LOG.warn("[$order.number][$task.articleCode]$filteredOrderTasks.articleCode Group not found for task")
				}
			}
		}
		return selectedGroupsInfo
	}

	/**
	 * Elimina las tareas absorbibles si existen otras que no lo sean (es decir, se dejan sólo las principales)
	 * @param orderTasks Lista de tareas de la orden
	 * @return Lista de tareas filtradas
	 */
	static List<Task> filterAbsorbableTasks(List<Task> orderTasks) {
		List<Task> mainTasks = orderTasks.findAll { !it.absorbable }
		return mainTasks ?: orderTasks
	}

	/**
	 * Se obtiene el grupo cuya coincidencia de tareas sea mayor comparada con las de laorden
	 * @param groups Lista de grupos de una tarea
	 * @param orderTasks Lista de tareas de la orden
	 * @return Grupo seleccionado
	 */
	static Group findSelectedGroup(Set<Group> groups, List<Task> orderTasks) {
		List<Group> possibleGroups = sortPossibleGroups(groups)
		Group selectedGroup = possibleGroups.find { Group group ->
			List<Task> commonTasks = orderTasks.findAll { it.articleCode in group.tasks*.articleCode }
			/* Si el tamaño de las tareas del grupo y las comunes es el mismo, significa que todas las del grupo están
			*  en la orden. Por lo tanto, ese sería el grupo seleccionado */
			return group.tasks.size() == commonTasks.size()
		}
		return selectedGroup
	}

	/**
	 * Ordena los grupos en función del orden en el que se tengan que seleccionar
	 * @param groups Lista de grupos
	 * @return Lista de grupos ordenada
	 */
	static List<Group> sortPossibleGroups(Set<Group> groups) {
		/* Se ordenan primero por número de tareas (grupo con 4 tareas más preferencia que uno de 3), después por
		*  orden del color, y en caso de igualdad, por código de agrupación (únicamente para evitar generación de
		*  agrupaciones distintas) */
		return groups.sort { Group a, Group b ->
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

	/**
	 * Obtiene las líneas de orden cuyo código de artículo está presente en una agrupación
	 * @param orderLines Líneas de la orden
	 * @param group Agrupación
	 * @return Lista de unidades
	 */
	static List<Float> getOrderGroupUnits(List<OrderLine> orderLines, Group group) {
		return orderLines.findAll {
			findUnitaryArticleCode(it.article.code) in group.tasks*.articleCode
		}*.units.collect { it as Float }
	}

	/**
	 * Construye las fichas de una orden basándose en los grupos y sus duraciones
	 * @param order Orden
	 * @param groupDurations Lista de grupos y sus duraciones
	 * @return Lista de fichas
	 */
	static List<Card> buildOrderCards(Order order, List<GroupUnits> groupDurations) {
		List<Card> orderCards = []
		groupDurations.each {
			if (it.duration) {
				orderCards << Builder.buildCard(order, it.group, it.units[0], it.duration)
			} else {
				LOG.info(new Log([message: Constants.Message.NOT_FOUND_DURATION, group: groupDurations.group.code]).toString())
			}
		}
		orderCards.sort { it.group.color.order }
		return orderCards
	}

	/**
	 * Comprueba si las fichas de la orden deben reemplazar otras ya existentes, como en el caso de eCommerce
	 * @param builtOrderCards Fichas de orden generadas
	 * @return boolean
	 */
	static boolean checkReplaceOrderCards(List<Card> builtOrderCards) {
		/* Se gestiona el reemplazo sólo si la ficha no está asignada, y si el código de creador de la orden es
		 * eCommerce */
		return !builtOrderCards[0].mechanicCode && builtOrderCards[0].order.creatorCode == Constants.ECOMMERCE_USER_CODE
	}

	/**
	 * Gestiona y obtiene las fichas que se deben reemplazar
	 * @param dbCards Lista de fichas de la base de datos
	 * @param orderCards Lista de fichas de la orden
	 * @return Objeto updateCards
	 */
	static UpdateCards handleCardsReplacement(List<Card> dbCards, List<Card> cards) {
		/* En el caso de eCommerce, sólo se reemplaza una ficha, ya que es la única que se crea cuando se reserva
		*  tiempo desde la web.
		*  La hora de creación de la orden debería coincidir con la hora de comienzo de la ficha temporal ya creada */
		UpdateCards updateCards = null
		Card cardToReplace = dbCards.find {
			it.type == Card.CardType.AUXILIARY && it.status == Card.Status.ECOMMERCE &&
				it.start == cards[0].order.created
		}
		if (cardToReplace) {
			List<Card> updatedOrderCards = updateReplacedCards(cardToReplace, cards)
			updateCards = new UpdateCards(newReplace: updatedOrderCards, deleted: [cardToReplace])
		}
		return updateCards
	}

	/**
	 * Actualiza la posición de varias fichas, sutituyendo a otra ya existente
	 * @param dbCard Ficha existente en BD
	 * @param cards Fichas recién creada
	 * @return Fichas actualizadas
	 */
	static List<Card> updateReplacedCards(Card dbCard, List<Card> cards) {
		cards.eachWithIndex { Card card, int i ->
			LocalTime start = i == 0 ? dbCard.start : cards[i - 1].start.plusMinutes(cards[i - 1].duration)
			updateReplacedCard(dbCard, card, start)
		}
		return cards
	}

	/**
	 * Actualiza la información de posición de la ficha que va a reemplazar a otra
	 * @param dbCard Ficha que va a ser reemplazada
	 * @param builtCard Ficha que va a reemplazar a la existente
	 * @return Ficha actualizada
	 */
	static Card updateReplacedCard(Card dbCard, Card card, LocalTime start = null) {
		card.day = dbCard.day
		card.mechanicCode = dbCard.mechanicCode
		card.line = dbCard.line
		card.start = start ?: dbCard.start
		return card
	}

	/**
	 * Gestiona y obtiene las fichas que se deben actualizar
	 * @param dbCards Lista de fichas de la base de datos
	 * @param orderCards Lista de fichas de la orden
	 * @return Objeto updateCards
	 */
	static UpdateCards handleCardsUpdate(List<Card> dbCards, List<Card> cards) {
		UpdateCards updateCards = new UpdateCards()
		cards.each {
			updateCards.add(handleCardUpdate(dbCards, it))
		}
		return updateCards
	}

	/**
	 * Gestiona la actualización de una ficha recién creada
	 * @param dbCards Fichas de base de datos
	 * @param builtCard Ficha recién creada
	 * @return Objeto updateCards
	 */
	static UpdateCards handleCardUpdate(List<Card> dbCards, Card builtCard) {
		UpdateCards updateCards = new UpdateCards()
		List<Card> dbOrderCards = dbCards.findAll { it.order.number == builtCard.order.number }

		/* Si en base de datos existen fichas asociadas al número de orden, se comprueba si alguna debe ser
        *  actualizada */
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
						updateCards.reset += dbGroupOrderCards.collect { resetCardPosition(it) }
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
					/* Si la nueva ficha no está reemplazando a una ya existente, es una completamente nueva */
					updateCards.newCards << builtCard
				}
			}
		} else {
			/* Si no se encuentran fichas asociadas al número de orden, significa que builtCard se ha construido
             * con la nueva orden */
			updateCards.newCards << builtCard
		}
		return updateCards
	}

	/**
	 * Comprueba si la info de JPDV ha sido actualizada
	 * @param dbCard Ficha de base de datos
	 * @param card Ficha recién construida
	 * @return boolean
	 */
	static Map<String, Object> checkUpdatedOrderInfo(Card dbCard, Card card) {
		Map<String, Object> orderDifferences = ((card.order.properties + card.vehicle.properties) -
			(dbCard.order.properties + dbCard.vehicle.properties)) as Map<String, Object>
		return orderDifferences
	}

	/**
	 * Actualiza una ficha con la nueva información de la orden
	 * @param dbCard Ficha de base de datos
	 * @param card Ficha recién construida
	 * @return Updated card
	 */
	static Card updateCardOrderInfo(Card dbCard, Card card) {
		dbCard.order = card.order
		dbCard.vehicle = card.vehicle
		return dbCard
	}

	/**
	 * Comprueba si las actualizaciones de una orden implican resetear la ficha (ocurre si cambian el día o la hora de
	 * una cita)
	 * @param orderDifferences Mapa con las diferencias de la orden existentes en una ficha
	 * @return booleano
	 */
	static boolean checkResetCards(Map<String, Object> orderDifferences) {
		return orderDifferences.find { it.key in Constants.RESET_NEW_CARDS_PROPERTIES }
	}

	/**
	 * Resetea la posición de una ficha
	 * @param card Ficha a resetear
	 * @return Ficha actualizada
	 */
	static Card resetCardPosition(Card card) {
		card.day = null
		card.mechanicCode = null
		card.start = null
		card.line = null
		card.status = Card.Status.DEFAULT
		return card
	}

	/**
	 * Encuentra la ficha existente a reemplazar basándose en las tareas del grupo. Si este no es el mismo, es
	 * necesario revisar las tareas para saber si la ficha está siendo reemplazada, o si se debe crear otra nueva
	 * @param dbOrderCards Fichas guardadas en DB
	 * @param builtCard Ficha construida
	 * @return Ficha a reemplazar
	 */
	static Card findReplacedCard(List<Card> dbOrderCards, Card builtCard) {
		List<Integer> builtCardTasksCodes = builtCard.group.tasks*.articleCode as List<Integer>
		Card replacedCard = dbOrderCards.find {
			List<Integer> dayOrderCardTasksCodes = it.group.tasks*.articleCode as List<Integer>
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
	 * Gestiona y obtiene las fichas que se deben borrar
	 * @param orders Lista de órdenes
	 * @param dbCards Lista de fichas de la BD
	 * @param cards Lista de fichas recién creadas
	 * @param sameCards Lista de fichas que no se han modificado
	 * @return Objeto updateCards
	 */
	static UpdateCards handleCardsDeletion(
		List<Order> orders, List<Card> dbCards, List<Card> cards, List<Card> sameCards
	) {
		List<Card> deletedCards = (findDeletedOrdersCards(orders, dbCards) +
				findUpdatedGroupDeletedCards(dbCards, cards)).collect {
			deleteCard(it, sameCards)
		}
		return new UpdateCards(deleted: deletedCards)
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
	 * Obtiene las fichas que se deben borrar porque ya no existe la orden
	 * @param orders Lista de ordenes
	 * @param cards Lista de fichas
	 * @return Lista de fichas para borrar
	 */
	static List<Card> findDeletedOrdersCards(List<Order> orders, List<Card> cards) {
		List<Card> cardsToDelete = cards.findAll {
			!(it.order.number in orders.number) && it.type != Card.CardType.AUXILIARY
		}
		return cardsToDelete
	}

	/**
	 * Obtiene las fichas que se deben borrar al haber cambiado las agrupaciones
	 * @param dbCards Lista de fichas de base de datos
	 * @param cards Lista de fichas recién construidas
	 * @return Lista de fichas para borrar
	 */
	static List<Card> findUpdatedGroupDeletedCards(List<Card> dbCards, List<Card> builtCards) {
		List<Card> cardsToDelete = dbCards.findAll { Card dbCard ->
			List<Card> builtOrderCards = builtCards.findAll { it.order.number == dbCard.order.number }
			Card orderAndGroupCard = builtOrderCards.find { it.group.code == dbCard.group.code }
			return builtOrderCards && !orderAndGroupCard
		}
		return cardsToDelete
	}

	/**
	 * Borra una ficha, reseteando los enlaces que pueda tener
	 * @param card Ficha a borrar
	 * @param cards Lista de fichas a las que puede ser necesario borrar el enlace
	 * @return Updated card
	 */
	static Card deleteCard(Card card, List<Card> sameCards) {
		card.dateDeleted = LocalDateTime.now()
		unlinkCards(card, sameCards)
		return card
	}

	/**
	 * Desenlaza la ficha borrada del resto de fichas que sigan en panel (si por ejemplo se elimina un grupo, pero no
	 * otro enlazado, este último debe dejar de estarlo)
	 * @param card Ficha borrada
	 * @param sameCards Fichas que siguen existiendo en panel
	 */
	static void unlinkCards(Card card, List<Card> sameCards) {
		Card nextCard = sameCards.find { it.linkedPrevious == card }
		if (nextCard) {
			nextCard.linkedPrevious = null
		}
		Card previousCard = sameCards.find { it.linkedNext == card }
		if (previousCard) {
			previousCard.linkedNext = null
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
			updateCards.newCards = cardDataService.saveCards(updateCards.newCards)
		}
		if (updateCards.newReplace) {
			updateCards.newReplace = cardDataService.saveCards(updateCards.newReplace)
		}
		if (updateCards.getUpdate()) {
			cardDataService.updateOrder(updateCards.getUpdate())
		}
		if (updateCards.deleted) {
			cardDataService.updateDeleted(updateCards.deleted)
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
		List<AppointmentDay> appointmentDays = days.collect { Builder.buildAppointmentDay(it, appointmentTypes) }
		fillAppointmentDays(appointmentDays, existentAppointmentDays, cards)
		UpdateAppointmentDays updateAppointmentDays = findUpdateAppointmentDays(existentAppointmentDays, appointmentDays)

		if (updateAppointmentDays.created) {
			appointmentDayDataService.save(updateAppointmentDays.created)
		}
		if (updateAppointmentDays.updated) {
			appointmentDayDataService.update(updateAppointmentDays.updated)
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
		LocalDate today = LocalDate.now()
		cards.groupBy { it.order.number }.each { int orderNumber, List<Card> orderCards ->
			LocalDate day = orderCards[0].order.day.isBefore(today) ? today : orderCards[0].order.day
			AppointmentDay appointmentDay = appointmentDays.find { it.day == day }
			if (appointmentDay) {
				List<Code> appointmentTypeCodes = findOrderCardsAppointmentTypes(orderCards)
				appointmentTypeCodes.each { Code code ->
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
	static List<Code> findOrderCardsAppointmentTypes(List<Card> cards) {
		/* Con que haya una sóla prestación de TP, toda la cita es de TP */
		if (cards.find { it.group.appointmentType.code == Code.TP }) {
			return [Code.TP]
		} else {
			/* Si no hay TP, pero se encuentra una prestación de INT, figura tanto en INT como en RAP */
			if (cards.find { it.group.appointmentType.code == Code.INT }) {
				return [Code.RAP, Code.INT]
			} else {
				return [Code.RAP]
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
