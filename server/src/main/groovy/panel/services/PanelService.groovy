package panel.services

import groovy.transform.CompileStatic
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import panel.clients.fviberi.FviberiDatabaseClient
import panel.clients.panel.PanelDatabaseClient
import panel.clients.schedules.SchedulesDatabaseClient
import panel.pogos.CompleteInfo
import panel.pogos.UpdateCards
import panel.utils.Constants
import utils.pogos.fviberi.Article
import utils.pogos.fviberi.Order
import utils.pogos.panel.Card
import utils.pogos.panel.Group
import utils.pogos.panel.GroupUnits
import utils.pogos.panel.JobLineType
import utils.pogos.panel.Task
import utils.pogos.schedules.EmployeeSchedule

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

	CompleteInfo getPanelInfo(Date day = new Date()) {
		List<JobLineType> jobLineTypes = panelDatabaseClient.getJobLineTypes().collect { (JobLineType) it }
		Map<String, List<EmployeeSchedule>> daysMechanics = getDaysMechanics(day)

		/* Se obtiene una lista con las órdenes que se deben reflejar en el panel (en función del estado) */
		List<Order> orders = fviberiDatabaseClient.getOrders(new Date(), Constants.ORDERS_QUERY_STATES).collect { (Order) it }
		/* Se obtiene una lista de fichas del día para comparar con las órdenes y sincronizarlas en la BD */
		List<Card> dayCards = panelDatabaseClient.getCards(day).collect { (Card) it }

		UpdateCards updateCards = syncOrders(orders, dayCards)
		List<Card> cards = saveCards(updateCards)
		return new CompleteInfo(daysMechanics, jobLineTypes, cards + updateCards.sameCards)
	}

	// region Mechanics

	/**
	 * Get day mechanics and load position if it is not defined yet
	 * @param date Day to get mechanics
	 * @return List of mechanic employees
	 */
	Map<String, List<EmployeeSchedule>> getDaysMechanics(Date date) {
		List<EmployeeSchedule> mechanics = schedulesDatabaseClient.getMechanics(date, true).collect {
			(EmployeeSchedule) it
		}
		Map<String, List<EmployeeSchedule>> daysMechanics = mechanics.groupBy { it.day?.toString() }
		return daysMechanics
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
		List<Task> orderTasks = tasks.findAll { it.articleCode in order.lines.article.code }

		List<Task> processedTasks = []
		List<GroupUnits> selectedGroupsInfo = []
		orderTasks.each { Task task ->
			boolean alreadyProcessedTask = processedTasks.find { it.articleCode == task.articleCode }
			if (!alreadyProcessedTask) {
				List<Group> possibleGroups = task.groups.findAll {
					!it.tasks.find { it.articleCode in processedTasks.articleCode }
				}.sort { a, b ->
					if (b.tasks.size() == a.tasks.size()) {
						return a.color.order <=> b.color.order
					} else {
						b.tasks.size() <=> a.tasks.size()
					}
				}
				Group selectedGroup = possibleGroups.find { Group group ->
					List<Task> commonTasks = orderTasks.findAll { it.articleCode in group.tasks.articleCode }
					return group.tasks.size() == commonTasks.size()
				}
				selectedGroupsInfo << new GroupUnits(selectedGroup, getOrderGroupUnits(order, selectedGroup))
				processedTasks += selectedGroup.tasks
			}
		}
		return selectedGroupsInfo
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
		Map<Integer, List<Map>> durationGroupsUnits = panelDatabaseClient.getDurations(
				(Map<Integer, List<GroupUnits>>) ordersGroupsUnits.collectEntries { [(it.key.number): (it.value)] }
		)

		List<Card> ordersCards = []
		durationGroupsUnits.each { Integer orderNumber, List<Map> groupsUnitsMap ->
			List<GroupUnits> groupsUnits = groupsUnitsMap.collect { (GroupUnits) it }
			Order order = orders.find { it.number == orderNumber }
			if (groupsUnits.duration) {
				groupsUnits.eachWithIndex { GroupUnits groupUnits, int i ->
//					Card linkedPrevious = ordersCards && ordersCards.last()?.order?.number == order.number ?
//							ordersCards.last() : null
					ordersCards << new Card(order, groupUnits.group, groupUnits.units[0], groupUnits.duration)
				}
			} else {
				LOG.warn("Duration not found for group: ${groupsUnits.group.code}")
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
	UpdateCards syncOrders(List<Order> orders, List<Card> dayCards) {
		/* Se obtiene una lista de todas las tareas de las distintas órdenes */
		List<Integer> articlesCodes = ((List<Article>) orders.lines.article.flatten()).findAll { it.labour }.code.unique()
		List<Task> ordersTasks = panelDatabaseClient.getTasks(articlesCodes).collect { (Task) it }

		/* Para cada orden, se obtienen sus agrupaciones y las unidades de cada uno de ellos */
		Map<Order, List<GroupUnits>> ordersGroupsUnits = getOrdersGroupsUnits(orders, ordersTasks)

		/* Se construyen las fichas a partir de la información de ordenes y grupos */
		List<Card> ordersCards = buildOrdersCards(orders, ordersGroupsUnits)

		/* A partir de las órdenes, las fichas guardadas y las recién construidas, se obtienen aquellas que deben ser
		*  actualizadas en DB */
		UpdateCards updateCards = getCardsToUpdate(orders, dayCards, ordersCards)
		return updateCards
	}

	static UpdateCards getCardsToUpdate(List<Order> orders, List<Card> dayCards, List<Card> builtCards) {
		/* Se obtienen las órdenes cuyas fichas deben ser creadas (número de orden no existe en las fichas actuales) */
		UpdateCards updateCards = getNewOrUpdatedCards(dayCards, builtCards)
		updateCards.deletedCards = getDeletedCards(orders, dayCards, builtCards)

		return updateCards
	}

	/**
	 * Get cards to create from existent orders, or cards to update
	 * @param dayCards List of cards of the day
	 * @param builtCards Cards built based on orders info
	 * @return UpdateCardsInfo with newCards and cardsToUpdate
	 */
	static UpdateCards getNewOrUpdatedCards(List<Card> dayCards, List<Card> builtCards) {
		UpdateCards updateCards = new UpdateCards()
		builtCards.each { Card builtCard ->
			List<Card> dayOrderCards = dayCards.findAll { it.order.number == builtCard.order.number }

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
		Card dayGroupOrderCard = dayOrderCards.find { it.group.code == builtCard.group.code }
		if (dayGroupOrderCard) {
			/* El grupo sigue siendo el mismo, por lo que se comprueba si ha cambiado alguna propiedad de la orden */
			if (checkUpdatedOrderInfo(dayGroupOrderCard, builtCard)) {
				updateCards.updatedCards << updateCardOrderInfo(dayGroupOrderCard, builtCard)
			} else {
				/* Fichas que no han sufrido ningún cambio, pero deben devolverse para que se carguen en panel */
				updateCards.sameCards << dayGroupOrderCard
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
			!(it.order.number in orders.number) && it.status != Card.Status.TEMPORAL
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
		card.dateDeleted = new Date()
		return card
	}

	// endregion

	// region Save cards

	/**
	 * Save cards in database, wether creating new rows or updating existing ones
	 * @param updateCards Object with cars to create, update or delete (update dateDeleted)
	 */
	List<Card> saveCards(UpdateCards updateCards) {
		List<Card> cards = []
		if (updateCards.newCards) {
			cards = panelDatabaseClient.createCards(updateCards.newCards).collect { (Card) it }
			/* Los IDs de las fichas se asignan una vez guardados en DB, por lo que es necesario realizar esta operación
			* para poder relacionar los IDS enlazados */
			relateCardsIds(cards)
			panelDatabaseClient.updateCardsLinks(cards)
		}
		if (updateCards.updatedCards) {
			cards += panelDatabaseClient.updateCards(updateCards.updatedCards).collect { (Card) it }
		}
		if (updateCards.deletedCards) {
			cards += panelDatabaseClient.deleteCards(updateCards.deletedCards.id).collect { (Card) it }
		}
		return cards
	}

	/**
	 * Relate linked cards IDs once the cards where saved in DB
	 * @param cards List of recently created cards
	 */
	static void relateCardsIds(List<Card> cards) {
		cards.groupBy { it.order.number }.each { int orderNumber, List<Card> orderCards ->
			orderCards.eachWithIndex { Card card, int i ->
				card.linkedPreviousId = i > 0 && orderCards[i-1].order.number == card.order.number ? orderCards[i-1].id : (Long) null
				card.linkedNextId = i < orderCards.size()-1 && orderCards[i+1].order.number == card.order.number ? orderCards[i+1].id : (Long) null
			}
		}
	}

	// endregion

}
