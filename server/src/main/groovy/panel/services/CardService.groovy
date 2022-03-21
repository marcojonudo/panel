package panel.services

import groovy.transform.CompileStatic
import jakarta.inject.Inject
import jakarta.inject.Singleton
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import panel.domains.fviberi.Order
import panel.domains.fviberi.OrderLine
import panel.domains.panel.Card
import panel.domains.panel.Group
import panel.domains.panel.GroupDuration
import panel.domains.panel.Task
import panel.pogos.cards.GroupUnits
import panel.pogos.firstLoad.UpdateCards
import panel.services.data.fviberi.OrderDataService
import panel.services.data.panel.GroupDurationDataService
import panel.services.data.panel.TaskDataService

@Singleton
@CompileStatic
class CardService {

	private static final Logger LOG = LoggerFactory.getLogger(CardService)

	@Inject OrderDataService orderDataService
	@Inject TaskDataService taskDataService
	@Inject GroupDurationDataService groupDurationDataService

	// region Sync orders with cards

//	UpdateCards syncJpdvOrders(
//		LocalDate from,
//		LocalDate lastScheduleDay,
//		List<Order> orders,
//		List<Card> cards,
//		List<AppointmentDay> appointmentDays = [],
//		List<AppointmentType> appointmentTypes = []
//	) {
//		UpdateCards updateCards = null
//		if (SyncOrdersSemaphore.trySyncOrders()) {
//			try {
//				List<Card> syncCards = fillCardsOrderLines(dbCards.findAll { !checkAvoidSync(it) }, orders)
//
//				updateCards = syncOrders(orders, syncCards)
//				updateCards.avoidSync = avoidSyncCards
//
//				List<LocalDate> days = []
//				for (LocalDate day = from; day <= lastScheduleDay; day = day.plusDays(1)) {
//					days << day
//				}
//				updateCards.appointmentDays = syncAppointmentDays(
//					days,
//					appointmentDays ?: appointmentDayDataService.findAll(from),
//					(appointmentTypes ?: appointmentTypeDataService.findAll()).findAll { it.counter },
//					updateCards.getAll().findAll { it.type == Card.CardType.APPOINTMENT }
//				)
//
//				saveCards(updateCards)
//			} catch(all) {
//				all.printStackTrace()
//				updateCards = findDbUpdateCards(from)
//			} finally {
//				SyncOrdersSemaphore.release()
//			}
//		} else {
//			SyncOrdersSemaphore.waitUntilUnlocked()
//			updateCards = findDbUpdateCards(from)
//		}
//		return updateCards
//	}
//
//	/**
//	 * Comprueba si la ficha debe sincronizarse con JPDV
//	 * @param card Ficha
//	 * @return booleano
//	 */
//	static boolean checkAvoidSync(Card card) {
//		/* No se sincronizan con JPDV las plantillas de las fichas auxiliares, ni las fichas de eCommerce cuyo status
//		*  no sea ECOMMERCE (si el status es CONFIRMED, se debe esperar a que se sustituya) */
//		return card.type == Card.CardType.AUXILIARY && card.status != Card.Status.ECOMMERCE
//	}
//
//	/**
//	 * Se rellena la lista de fichas con información sobre la orden
//	 * @param cards Lista de fichas
//	 * @param orders Lista de ordenes
//	 * @return
//	 */
//	static List<Card> fillCardsOrderLines(List<Card> cards, List<Order> orders) {
//		cards.each { Card card ->
//			Order order = orders.find { it.number == card.order.number }
//			/* Las fichas auxiliares no tienen orden */
//			if (order) {
//				card.order.lines = filterOrderLines(order)
//			}
//		}
//		return cards
//	}
//
//	UpdateCards findDbUpdateCards(LocalDate from) {
//		List<Card> dbCards = cardDataService.findAllFrom(from)
//		List<Card> auxiliaryCards = dbCards.findAll { checkAvoidSync(it) }
//		return new UpdateCards(dbCards, auxiliaryCards)
//	}

	/**
	 * Sincroniza las ordenes de JPDV con las fichas existentes en panel
	 * @param orders Lista de ordenes
	 * @return Lista de fichas de base de datos
	 */
	UpdateCards syncOrders(List<Order> orders, List<Card> dbCards) {
		UpdateCards ordersUpdateCards = new UpdateCards()
		List<Task> tasks = taskDataService.findAll()
		List<GroupDuration> durations = groupDurationDataService.findAll()
		orders.each {
			List<OrderLine> lines = it.findLabourLines()

			List<Group> groups = findOrderGroups(it, tasks)
			List<GroupUnits> groupUnits = findOrderGroupsUnits(groups, lines, durations)
//			if (groupUnits) {
//				List<GroupUnits> groupsDurations = groupDurationDataService.findAll(groupsUnits)
//				List<Card> orderCards = buildOrderCards(it, groupsDurations)
//
//				boolean replaceOrderCards = checkReplaceOrderCards(orderCards)
//				UpdateCards updateCards = null
//				if (replaceOrderCards) {
//					updateCards = handleCardsReplacement(dbCards, orderCards)
//				}
//				updateCards = updateCards ?: handleCardsUpdate(dbCards, orderCards)
//				ordersUpdateCards.add(updateCards)
//			}
		}
//		UpdateCards deleteUpdateCards = handleCardsDeletion(
//			orders, dbCards, ordersUpdateCards.getAll(), ordersUpdateCards.same
//		)
//		ordersUpdateCards.add(deleteUpdateCards)
		return ordersUpdateCards
	}

	/**
	 * Encuentra los grupos y unidades asociados a una orden
	 * @param order Orden
	 * @return Lista de grupos y unidades asociados
	 */
	static List<Group> findOrderGroups(Order order, List<Task> allTasks) {
		/* Se obtienen los artículos sin el primer dígito, que no identifica el propio artículo */
		List<Integer> articleCodes = order.findLabourLines().article.collect { it.findUnitaryCode() }
		List<Task> tasks = allTasks.findAll { it.articleCode in articleCodes }
		List<Task> orderTasks = findAbsorbableTasks(tasks)

		List<Group> groups = ((List<Group>) tasks.groups.flatten()).unique { it.code }
		List<Group> orderGroups = sortGroups(groups)

		return findTasksGroups(orderGroups, orderTasks)
	}

	/**
	 * Get order groups and units based on its articles
	 * @param order Order from which to get the groups
	 * @param tasks List of all tasks
	 * @return List of GroupUnits
	 */
//	static List<Group> findOrderTasksGroups(List<Task> tasks) {
//		/* Se filtran las tareas absorbibles */
////		List<Task> filteredTasks = findAbsorbableTasks(tasks)
//		List<Group> groups = findTasksGroups(filteredTasks)
//		return findSelectedGroups(groups, filteredTasks)
//	}

	/**
	 * Elimina las tareas absorbibles si existen otras que no lo sean (es decir, se dejan sólo las principales)
	 * @param orderTasks Lista de tareas de la orden
	 * @return Lista de tareas filtradas
	 */
	static List<Task> findAbsorbableTasks(List<Task> orderTasks) {
		return orderTasks.findAll { !it.absorbable } ?: orderTasks
	}


	static List<Group> findTasksGroups(List<Group> groups, List<Task> remainingTasks, List<Group> selectedGroups = []) {
		/* Se obtienen aquellos grupos cuyas tareas figuran en filteredTasks */
		int selectedGroupIndex = groups.findIndexOf { Group group ->
			/* Se obtienen las tareas del grupo que están en la lista completa de tareas */
			Set<Task> tasksInList = group.tasks.findAll { it in remainingTasks }
			/* Si las tareas existentes son iguales que las tareas del grupo, significa que el grupo completo está
			 * representado */
			return tasksInList.size() == group.tasks.size()
		}
		if (selectedGroupIndex != -1) {
			selectedGroups << groups[selectedGroupIndex]
			groups[selectedGroupIndex].tasks.each { remainingTasks.remove(it) }
			List<Group> remainingGroups = groups.size() > 1 ? groups[selectedGroupIndex + 1..-1] : groups
			return remainingTasks ? findTasksGroups(remainingGroups, remainingTasks, selectedGroups) : selectedGroups
		}
		return selectedGroups
	}

	static List<Group> sortGroups(List<Group> groups) {
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
	 * Se obtiene el grupo cuya coincidencia de tareas sea mayor comparada con las de la orden
	 * @param groups Lista de grupos de una tarea
	 * @param orderTasks Lista de tareas de la orden
	 * @return Grupo seleccionado
	 */
	static List<Group> findSelectedGroups(List<Group> groups, List<Task> remainingTasks, List<Group> selectedGroups = []) {
		int groupIndex = groups.findIndexOf {
			Set<Task> existentTasks = it.tasks.findAll { it in remainingTasks }
			return existentTasks.size() == it.tasks.size()
		}
		if (groupIndex != -1) {
			Group group = groups[groupIndex]
			selectedGroups << group
			return findSelectedGroups(
				groups[groupIndex..-1], remainingTasks.findAll { !(it in group.tasks) }, selectedGroups
			)
		}
		return selectedGroups
	}

	static List<GroupUnits> findOrderGroupsUnits(
		List<Group> groups, List<OrderLine> lines, List<GroupDuration> durations
	) {
		List<OrderLine> flattenedLines = flattenOrderLines(lines)
		return groups.collect { Group group ->
			List<Integer> codes = group.tasks*.articleCode as List<Integer>
			List<Integer> occurrences = codes.collect { int code ->
				lines.findAll { it.article.findUnitaryCode() == code }.size()
			}

//			List<Float> units = lines
//				.findAll { it.article.findUnitaryCode() in group.tasks*.articleCode }
//				.collect { it as Float }

			return new GroupUnits(group, [])
		}
	}

	static List<OrderLine> flattenOrderLines(List<OrderLine> lines) {
		List<OrderLine> flattened = []
		lines.each { OrderLine line ->
			line.units.times {
				flattened << line
			}
		}
		return flattened
	}

//	static Float findGroupDuration(Group group, List<Float> units, List<GroupDuration> durations) {
//		GroupDuration duration = durations.find {
//			it.groupId == group.id && (it.units == (units[0] as int) && it.units == 1)
//		}
//		duration = duration ?:
//	}
//
//	/**
//	 * Se obtiene el grupo cuya coincidencia de tareas sea mayor comparada con las de la orden
//	 * @param groups Lista de grupos de una tarea
//	 * @param orderTasks Lista de tareas de la orden
//	 * @return Grupo seleccionado
//	 */
//	static Group findSelectedGroup2(Set<Group> groups, List<Task> orderTasks) {
//		List<Group> possibleGroups = sortPossibleGroups(groups)
//		Group selectedGroup = possibleGroups.find { Group group ->
//			List<Task> commonTasks = orderTasks.findAll { it.articleCode in group.tasks*.articleCode }
//			/* Si el tamaño de las tareas del grupo y las comunes es el mismo, significa que todas las del grupo están
//			*  en la orden. Por lo tanto, ese sería el grupo seleccionado */
//			return group.tasks.size() == commonTasks.size()
//		}
//		return selectedGroup
//	}
//
//	/**
//	 * Ordena los grupos en función del orden en el que se tengan que seleccionar
//	 * @param groups Lista de grupos
//	 * @return Lista de grupos ordenada
//	 */
//	static List<Group> sortPossibleGroups(List<Group> groups) {
//		/* Se ordenan primero por número de tareas (grupo con 4 tareas más preferencia que uno de 3), después por
//		*  orden del color, y en caso de igualdad, por código de agrupación (únicamente para evitar generación de
//		*  agrupaciones distintas) */
//		return groups.sort { Group a, Group b ->
//			if (b.tasks.size() == a.tasks.size()) {
//				if (a.color.order == b.color.order) {
//					return a.code <=> b.code
//				} else {
//					return a.color.order <=> b.color.order
//				}
//			} else {
//				return b.tasks.size() <=> a.tasks.size()
//			}
//		}
//	}
//
//	/**
//	 * Obtiene las líneas de orden cuyo código de artículo está presente en una agrupación
//	 * @param orderLines Líneas de la orden
//	 * @param group Agrupación
//	 * @return Lista de unidades
//	 */
//	static List<Float> getOrderGroupUnits(List<OrderLine> orderLines, Group group) {
//		return orderLines.findAll {
//			findUnitaryArticleCode(it.article.code) in group.tasks*.articleCode
//		}*.units.collect { it as Float }
//	}

}
