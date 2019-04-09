package panel.services

import groovy.transform.CompileStatic
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import panel.clients.fviberi.FviberiDatabaseClient
import panel.clients.panel.PanelDatabaseClient
import panel.clients.schedules.SchedulesDatabaseClient
import panel.utils.Constants
import utils.pogos.EmployeeSchedule
import utils.pogos.fviberi.Article
import utils.pogos.fviberi.Order
import utils.pogos.panel.Card
import utils.pogos.panel.Group
import utils.pogos.panel.GroupUnits
import utils.pogos.panel.Task

import javax.inject.Singleton

@Singleton
@CompileStatic
class PanelService {

	private static final Logger LOG = LoggerFactory.getLogger(PanelService)

	PanelDatabaseClient panelDatabaseClient
	FviberiDatabaseClient fviberiDatabaseClient
	SchedulesDatabaseClient schedulesDatabaseClient

	PanelService(PanelDatabaseClient panelDatabaseClient,
	             FviberiDatabaseClient fviberiDatabaseClient,
	             SchedulesDatabaseClient schedulesDatabaseClient) {
		this.panelDatabaseClient = panelDatabaseClient
		this.fviberiDatabaseClient = fviberiDatabaseClient
		this.schedulesDatabaseClient = schedulesDatabaseClient
	}

	Map getPanelInfo(Date day = new Date()) {
		List<EmployeeSchedule> dayMechanics = getDayMechanics(new Date())

		/* Se obtiene una lista con las órdenes que se deben reflejar en el panel (en función del estado) */
		List<Order> orders = fviberiDatabaseClient.getOrders(new Date(), Constants.ORDERS_QUERY_STATES).collect { (Order) it }
		/* Se obtiene una lista de fichas del día para comparar con las órdenes y sincronizarlas en la BD */
		List<Card> dayCards = panelDatabaseClient.getCards(day).collect { (Card) it }

		List<Card> cards = syncOrders(orders, dayCards)
		return [dayMechanics: dayMechanics, cards: cards]
	}

	// region Mechanics

	/**
	 * Get day mechanics and load position if it is not defined yet
	 * @param date Day to get mechanics
	 * @return List of mechanic employees
	 */
	List<EmployeeSchedule> getDayMechanics(Date date) {
		List<EmployeeSchedule> dayMechanics = schedulesDatabaseClient.getDayMechanics(date).collect { (EmployeeSchedule) it }
		dayMechanics = loadEmployeesPosition(dayMechanics).sort { it.panelInfo.position }
		return dayMechanics
	}

	/**
	 * Define panel mechanic position if it is not defined yet
	 * @param dayMechanics List of day mechanics
	 * @return List of mechanics with loaded position
	 */
	List<EmployeeSchedule> loadEmployeesPosition(List<EmployeeSchedule> dayMechanics) {
		boolean mechanicWithoutPosition = dayMechanics.find { !it.panelInfo.position }
		if (mechanicWithoutPosition) {
			dayMechanics.eachWithIndex { EmployeeSchedule employeeSchedule, int i ->
				employeeSchedule.panelInfo.position = Constants.A_Z[i]
			}
			dayMechanics = schedulesDatabaseClient.updateEmployeesSchedulesPosition(dayMechanics).collect { (EmployeeSchedule) it }
		}
		return dayMechanics
	}

	// endregion

	// region Build cards

	/**
	 * Get orders groups and its units to get the card duration
	 * @param orders List of Order
	 * @param tasks List of all tasks
	 * @return Map with orders and its groups and units
	 */
	static Map<Order, List<GroupUnits>> getOrdersGroups(List<Order> orders, List<Task> tasks) {
		Map<Order, List<GroupUnits>> ordersGroups = orders.collectEntries {
			[(it): (getOrderGroups(it, tasks))]
		}
		return ordersGroups
	}

	/**
	 * Get order groups and units based on its articles
	 * @param order Order from which to get the groups
	 * @param tasks List of all tasks
	 * @return List of GroupUnits
	 */
	static List<GroupUnits> getOrderGroups(Order order, List<Task> tasks) {
		/* Se obtienen las task correspondientes a los artículos de la orden */
		List<Task> orderTasks = tasks.findAll { it.articleCode in order.lines.article.code }

		/* Se identifican las agrupaciones en función del número de tareas que tenga cada una.
		 * Si una tarea pertenece a más de un grupo, tiene prioridad aquel que mayor número de tareas tenga */
		Map<Integer, List<Group>> orderedGroups = ((List<Group>) orderTasks.groups.flatten()).groupBy { it.code }.sort { a, b ->
			b.value.size() <=> a.value.size()
		}

		/* Se procesan los grupos en orden, evitando que una tarea aparezca en más de uno */
		List<Task> processedTasks = []
		List<GroupUnits> selectedGroupsInfo = []
		orderedGroups.each { int groupCode, List<Group> groups ->
			List<Task> orderGroupTasks = orderTasks.findAll { groupCode in it.groups.code }

			boolean alreadyProcessedTask = processedTasks.find { it.articleCode in orderGroupTasks.articleCode }
			if (!alreadyProcessedTask) {
				processedTasks += orderGroupTasks
				List<Float> units = order.lines.findAll {
					it.article.code in orderGroupTasks.articleCode
				}.sort { it.article.code }.units.collect { it as Float }
				selectedGroupsInfo << new GroupUnits(groups[0], units)
			}
		}
		return selectedGroupsInfo
	}

	/**
	 * Build order cards based on order info and groups
	 * @param ordersGroups Orders with their associated groups and units
	 * @return List of Card
	 */
	List<Card> buildOrdersCards(Map<Order, List<GroupUnits>> ordersGroups) {
		List<GroupUnits> ordersGroupsUnits = (List<GroupUnits>) ordersGroups.values().flatten()
		List<Integer> durations = panelDatabaseClient.getDurations(ordersGroupsUnits)

		List<Card> ordersCards = []
		if (ordersGroupsUnits.size() != durations.size()) {
			LOG.error("Durations not found for all the groups: ${ordersGroupsUnits.group.code}")
		} else {
			int durationIndex = 0
			ordersCards = (List<Card>) ordersGroups.inject([]) { List<Card> orderCards, Order order, List<GroupUnits> groupsUnits ->
				List<Card> cards = groupsUnits.collect { new Card(order, it.group, it.units[0], durations[durationIndex++]) }
				orderCards = orderCards + cards
				return orderCards
			}
		}

		return ordersCards
	}

	// endregion

	// region Sync orders with cards

	/**
	 * Sync orders with created cards and update them
	 * @param orders List of Order
	 * @return List of Card
	 */
	List<Card> syncOrders(List<Order> orders, List<Card> dayCards) {
		/* Se obtiene una lista de todas las tareas de las distintas órdenes */
		List<Integer> articlesCodes = ((List<Article>) orders.lines.article.flatten()).findAll { it.labour }.unique().code
		List<Task> ordersTasks = panelDatabaseClient.getTasks(articlesCodes).collect { (Task) it }

		/* Para cada orden, se obtienen sus agrupaciones y las unidades de cada uno de ellos */
		Map<Order, List<GroupUnits>> ordersGroups = getOrdersGroups(orders, ordersTasks)

		/* Se construyen las fichas a partir de la información de ordenes y grupos */
		List<Card> ordersCards = buildOrdersCards(ordersGroups)

		List<Card> handledCards = handleCards(orders, dayCards, ordersCards)

		return handledCards
	}

	static List<Card> handleCards(List<Order> orders, List<Card> dayCards, List<Card> builtCards) {
		/* Se obtienen las órdenes cuyas fichas deben ser creadas (número de orden no existe en las fichas actuales) */
//		List<Card> newOrdersCards = getNewOrdersCards(dayCards, builtCards)
		List<Card> updatedCards = getNewOrUpdatedCards(dayCards, builtCards)
		List<Card> deletedCards = getDeletedCards(orders, dayCards, builtCards)

		return updatedCards + deletedCards
	}

//	/**
//	 * Get cards to create in database
//	 * @param dayCards Already created cards
//	 * @param builtCards Cards built based on orders info
//	 * @return List of cards to create
//	 */
//	static List<Card> getNewOrdersCards(List<Card> dayCards, List<Card> builtCards) {
//		List<Card> newCards = builtCards.findAll { !(it.orderInfo.number in dayCards.orderInfo.number) }
//		return newCards
//	}

	/**
	 * Get cards to create from existent orders, or cards to update
	 * @param dayCards List of cards of the day
	 * @param builtCards Cards built based on orders info
	 * @return UpdateCardsInfo with newCards and cardsToUpdate
	 */
	static List<Card> getNewOrUpdatedCards(List<Card> dayCards, List<Card> builtCards) {
		List<Card> updatedCards = []
		builtCards.each { Card builtCard ->
			List<Card> dayOrderCards = dayCards.findAll { it.orderInfo.number == builtCard.orderInfo.number }

			if (dayOrderCards) {
				boolean handledCards = handleExistentGroupCard(dayOrderCards, builtCard, updatedCards)
				if (!handledCards) {
					/* Si el grupo de builtCard no coincide con ninguno de dayOrderCards, se comprueba si ha reemplazado
					*  a alguno existente o si es una ficha completamente nueva */
					handleReplacedGroupCard(dayOrderCards, builtCard, updatedCards)
				}
			} else {
				/* Si no se encuentran fichas asociadas al número de orden, significa que builtCard se ha construido
				 * con la nueva orden */
				updatedCards << builtCard
			}
		}

		return updatedCards
	}

	/**
	 * Handle existent group new card. Update updatedCards list if builtCard has been updated from JPDV
	 * @param dayOrderCards Saved day order cards
	 * @param builtCard Built card
	 * @param updatedCards List of updated cards
	 * @return boolean
	 */
	static boolean handleExistentGroupCard(List<Card> dayOrderCards, Card builtCard, List<Card> updatedCards) {
		Card dayGroupOrderCard = dayOrderCards.find { it.group.code == builtCard.group.code }
		if (dayGroupOrderCard) {
			/* El grupo sigue siendo el mismo, por lo que se comprueba si ha cambiado alguna propiedad de la orden */
			if (checkUpdatedOrderInfo(dayGroupOrderCard, builtCard)) {
				updatedCards << updateCardOrderInfo(dayGroupOrderCard, builtCard)
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
	static void handleReplacedGroupCard(List<Card> dayOrderCards, Card builtCard, List<Card> updatedCards) {
		Card replacedCard = findReplacedCard(dayOrderCards, builtCard)
		if (replacedCard) {
			if (checkUpdatedOrderInfo(replacedCard, builtCard)) {
				updatedCards << updateCardOrderInfo(updateCardGroupInfo(replacedCard, builtCard), builtCard)
			} else {
				updatedCards << updateCardGroupInfo(replacedCard, builtCard)
			}
		} else {
			updatedCards << builtCard
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
		Map orderInfoDifferences = (builtCard.orderInfo.properties + builtCard.orderInfo.vehicleInfo.properties) -
				(dayCard.orderInfo.properties + dayCard.orderInfo.vehicleInfo.properties)
		/* Si no cambia ninguna propiedad, el mapa tendrá sólo la entrada correspondiente al objeto
		*  vehicleInfo */
		return orderInfoDifferences.size() > 1
	}

	/**
	 * Update card object with new built card order info
	 * @param builtCard Newly built card
	 * @param dayCard Already saved card
	 * @return Updated card
	 */
	static Card updateCardOrderInfo(Card dayCard, Card builtCard) {
		dayCard.orderInfo = builtCard.orderInfo
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
	static List<Card> getDeletedCards(List<Order> orders, List<Card> dayCards, List<Card> builtCards) {
		List<Card> cardsToDelete = getDeletedOrdersCards(orders, dayCards)
		cardsToDelete += getUpdatedGroupDeletedCards(dayCards, builtCards)
		List<Card> deletedCards = cardsToDelete.collect { deleteCard(it) }
		return deletedCards
	}

	/**
	 * Get cards to delete because order no longer exists
	 * @param orders List of orders
	 * @param builtCards Cards saved for day
	 * @return List of cards to delete
	 */
	static List<Card> getDeletedOrdersCards(List<Order> orders, List<Card> dayCards) {
		List<Card> cardsToDelete = dayCards.findAll {
			!(it.orderInfo.number in orders.number) && it.status != Card.Status.TEMPORAL
		}
		return cardsToDelete
	}

	/**
	 * Get cards to delete because order tasks changed and its group is no longer necessary
	 * @param orders List of orders
	 * @param builtCards Cards built based on orders info
	 * @return List of cards to delete
	 */
	static List<Card> getUpdatedGroupDeletedCards(List<Card> dayCards, List<Card> builtCards) {
		List<Card> cardsToDelete = dayCards.findAll { Card dayCard ->
			List<Card> builtOrderCards = builtCards.findAll { it.orderInfo.number == dayCard.orderInfo.number }
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
		card.dateDeleted = new Date()
		return card
	}

	// endregion

}
