package panel.services

import io.micronaut.test.annotation.MicronautTest
import io.micronaut.test.annotation.MockBean
import panel.clients.fviberi.FviberiDatabaseApi
import panel.clients.fviberi.FviberiDatabaseClient
import panel.clients.panel.PanelDatabaseApi
import panel.clients.panel.PanelDatabaseClient
import panel.clients.schedules.SchedulesDatabaseApi
import panel.clients.schedules.SchedulesDatabaseClient
import panel.pogos.UpdateCards
import spock.lang.Shared
import spock.lang.Specification
import utils.pogos.fviberi.*
import utils.pogos.panel.Card
import utils.pogos.panel.Group
import utils.pogos.panel.GroupUnits
import utils.pogos.panel.Task
import utils.pogos.schedules.EmployeeSchedule

import javax.inject.Inject

@MicronautTest
class PanelServiceSpec extends Specification {

	// region Collaborators

	@Inject
	PanelService panelService

	@Inject
	PanelDatabaseClient panelDatabaseClient

	@Inject
	SchedulesDatabaseClient schedulesDatabaseClient

	@MockBean(PanelDatabaseApi)
	PanelDatabaseClient panelDatabaseClient() {
		Mock(PanelDatabaseClient)
	}

	@MockBean(FviberiDatabaseApi)
	FviberiDatabaseClient fviberiDatabaseClient() {
		Mock(FviberiDatabaseClient)
	}

	@MockBean(SchedulesDatabaseApi)
	SchedulesDatabaseClient schedulesDatabaseClient() {
		Mock(SchedulesDatabaseClient)
	}

	// endregion

	// region Variables

	@Shared
	Order order4Articles = new Order(
			number: 1,
			timeInfo: [new OrderTime(shortCode: 'C1')],
			lines: [
					new OrderLine(article: new Article(code: 1)),
					new OrderLine(article: new Article(code: 2)),
					new OrderLine(article: new Article(code: 3)),
					new OrderLine(article: new Article(code: 4)),
			],
			vehicle: new Vehicle([:])
	)

	@Shared
	Order order1Article = new Order(
			number: 2,
			timeInfo: [new OrderTime(shortCode: 'C2')],
			lines: [
					new OrderLine(article: new Article(code: 1))
			],
			vehicle: new Vehicle([:])
	)

	@Shared Task task1 = new Task(articleCode: 1)
	@Shared Task task2 = new Task(articleCode: 2)
	@Shared Task task3 = new Task(articleCode: 3)
	@Shared Task task4 = new Task(articleCode: 4)
	@Shared Group group1 = new Group(code: 1, shortName: 'group1')
	@Shared Group group2 = new Group(code: 2)
	@Shared Group group3 = new Group(code: 3)
	@Shared Group group4 = new Group(code: 4)
	@Shared Group group5 = new Group(code: 5)

	// endregion

	// region getDaysMechanics

	void "test get day mechanics sort correct not defined positions"() {
		given:
		Date date = new Date()
		List<Map> dayMechanics = [
				[day: 1567090800000],
				[day: 1567090800000],
				[day: 1566939600000]
		]
		schedulesDatabaseClient.getMechanics(date, true) >> dayMechanics

		when:
		Map<java.sql.Date, List<EmployeeSchedule>> daysMechanics = panelService.getDaysMechanics(date)

		then:
		daysMechanics.size() == 2
		daysMechanics[new java.sql.Date(new Date(1567090800000).time)].size() == 2
		daysMechanics[new java.sql.Date(new Date(1566939600000).time)].size() == 1
	}

	// endregion

	// region getOrderGroups

	void "test get order groups 1"() {
		given:
		group1.tasks = [task1]
		group2.tasks = [task2]
		group3.tasks = [task3]
		group4.tasks = [task4]
		group5.tasks = [task1, task2, task4]
		task1.groups = [group1, group5]
		task2.groups = [group2, group5]
		task3.groups = [group3]
		task4.groups = [group4, group5]

		when:
		List<GroupUnits> groupUnits = panelService.getOrderGroups(order4Articles, [task1, task2, task3, task4])

		then:
		groupUnits.size() == 2
		groupUnits[0].group.code == 5
		groupUnits[1].group.code == 3
	}

	void "test get order groups 2"() {
		given:
		group1.tasks = [task1]
		group2.tasks = [task2]
		group3.tasks = [task3]
		group4.tasks = [task4]
		task1.groups = [group1]
		task2.groups = [group2]
		task3.groups = [group3]
		task4.groups = [group4]

		when:
		List<GroupUnits> groupUnits = panelService.getOrderGroups(order4Articles, [task1, task2, task3, task4])

		then:
		groupUnits.size() == 4
		groupUnits[0].group.code == 1
		groupUnits[1].group.code == 2
		groupUnits[2].group.code == 3
		groupUnits[3].group.code == 4
	}

	void "test get order groups 3"() {
		given:
		group1.tasks = [task1, task2]
		group2.tasks = [task1, task3]
		group3.tasks = [task2, task4]
		group4.tasks = [task3]
		group5.tasks = [task4]
		task1.groups = [group1, group2]
		task2.groups = [group1, group3]
		task3.groups = [group2, group4]
		task4.groups = [group3, group5]

		when:
		List<GroupUnits> groupUnits = panelService.getOrderGroups(order4Articles, [task1, task2, task3, task4])

		then:
		groupUnits.size() == 3
		groupUnits[0].group.code == 1
		groupUnits[1].group.code == 4
		groupUnits[2].group.code == 5
	}

	void "test get order groups one article one absorbable task"() {
		given:
		group1.tasks = [task1]
		task1.absorbable = true
		task1.groups = [group1]
//		List<Task> tasks = [
//				new Task(articleCode: 1, absorbable: true, groups: [new Group(code: 1)])
//		]

		when:
		List<GroupUnits> groupUnits = panelService.getOrderGroups(order1Article, [task1])

		then:
		groupUnits.size() == 1
		groupUnits[0].group.code == 1
	}

	void "test get order groups several articles several absorbable tasks"() {
		given:
		group1.tasks = [task1, task2, task3, task4]
		task2.absorbable = true
		task3.absorbable = true
		task4.absorbable = true
		task1.groups = [group1]
		task2.groups = [group1]
		task3.groups = [group1]
		task4.groups = [group1]

		when:
		List<GroupUnits> groupUnits = panelService.getOrderGroups(order4Articles, [task1, task2, task3, task4])

		then:
		groupUnits.size() == 1
		groupUnits[0].group.code == 1
	}

	// endregion

	// region buildOrdersCards

	void "test build order cards 1"() {
		given:
		GroupUnits groupUnits = new GroupUnits(group1, [1])
		Map<Order, List<GroupUnits>> ordersGroupsUnits = [
				(order1Article): [groupUnits]
		]
		panelDatabaseClient.getDurations(
				(Map<Integer, List<GroupUnits>>) ordersGroupsUnits.collectEntries { [(it.key.number): (it.value)] }
		) >> [(order1Article.number): [[group: group1, units: 1, duration: 30]]]

		when:
		List<Card> cards = panelService.buildOrdersCards([order1Article], ordersGroupsUnits)

		then:
		cards.size() == 1
		cards[0].order.number == order1Article.number
		cards[0].order.code == order1Article.timeInfo.shortCode
		cards[0].code == group1.shortName
		cards[0].group.code == group1.code
		cards[0].status == Card.Status.DEFAULT
		cards[0].duration == 30
	}

	void "test build order cards 2"() {
		given:
		GroupUnits groupUnits1 = new GroupUnits(group1, [1])
		GroupUnits groupUnits2 = new GroupUnits(group2, [1, 1])
		GroupUnits groupUnits3 = new GroupUnits(group3, [3])
		Map<Order, List<GroupUnits>> ordersGroupsUnits = [
				(order1Article): [groupUnits1],
				(order4Articles): [groupUnits1, groupUnits2, groupUnits3]
		]
		panelDatabaseClient.getDurations(
				(Map<Integer, List<GroupUnits>>) ordersGroupsUnits.collectEntries { [(it.key.number): (it.value)] }
		) >> [
				(order1Article.number): [[group: group1, units: 1, duration: 10]],
				(order4Articles.number): [
						[group: group1, units: 1, duration: 10],
						[group: group2, units: 2, duration: 30],
						[group: group3, units: 3, duration: 45]
				],
		]

		when:
		List<Card> cards = panelService.buildOrdersCards([order1Article, order4Articles], ordersGroupsUnits)

		then:
		cards.size() == 4
		cards[0].order.number == order1Article.number
		cards[0].group.code == group1.code
		cards[0].duration == 10
		cards[1].order.number == order4Articles.number
		cards[1].group.code == group1.code
		cards[1].duration == 10
		cards[2].order.number == order4Articles.number
		cards[2].group.code == group2.code
		cards[2].duration == 30
		cards[3].order.number == order4Articles.number
		cards[3].group.code == group3.code
		cards[3].duration == 45
	}

	void "test build order cards duration not found for group"() {
		given:
		GroupUnits groupUnits1 = new GroupUnits(group1, [1])
		Map<Order, List<GroupUnits>> ordersGroupsUnits = [
				(order1Article): [groupUnits1]
		]
		panelDatabaseClient.getDurations(
				(Map<Integer, List<GroupUnits>>) ordersGroupsUnits.collectEntries { [(it.key.number): (it.value)] }
		) >> [(order1Article.number): []]

		when:
		List<Card> cards = panelService.buildOrdersCards([order1Article], ordersGroupsUnits)

		then:
		!cards
	}

	// endregion

//	// region checkUpdatedOrderInfo

	void "test check updated card same fields"() {
		given:
		Card builtCard = new Card(duration: 10, code: 'code', order: [number: 1, state: Order.State.A], mechanicCode: '1', status: Card.Status.TEMPORAL, vehicle: [brand: 'FV'])
		Card dayCard = new Card(duration: 10, code: 'code', order: [number: 1, state: Order.State.A], mechanicCode: '1', status: Card.Status.TEMPORAL, vehicle: [brand: 'FV'])

		when:
		boolean updated = panelService.checkUpdatedOrderInfo(dayCard, builtCard)

		then:
		!updated
	}

	void "test check updated card updated order info"() {
		given:
		Card builtCard = new Card(order: [number: 1, code: 'C1'], duration: 20, vehicle: [brand: 'FV'])
		Card dayCard = new Card(order: [number: 1, code: 'C2'], duration: 20, vehicle: [brand: 'FV'])

		when:
		boolean updated = panelService.checkUpdatedOrderInfo(dayCard, builtCard)

		then:
		updated
	}

	void "test check updated card updated vehicle info"() {
		given:
		Card builtCard = new Card(order: [number: 1], vehicle: [brand: 'FV'], duration: 30)
		Card dayCard = new Card(order: [number: 1], vehicle: [brand: 'BMW'], duration: 30)

		when:
		boolean updated = panelService.checkUpdatedOrderInfo(dayCard, builtCard)

		then:
		updated
	}

	// endregion

	// region updateCardOrderInfo

	void "test update card order info"() {
		given:
		Card dayCard = new Card(order: [number: 1, state: 'A'], vehicle: [brand: 'BMW'], duration: 10)
		Card builtCard = new Card(order: [number: 1, state: 'V'], vehicle: [brand: 'FV'], duration: 10)

		when:
		Card updatedDayCard = panelService.updateCardOrderInfo(dayCard, builtCard)

		then:
		updatedDayCard.vehicle.brand == 'FV'
		updatedDayCard.order.state == Order.State.V
	}

	// endregion

	// region findReplacedCard

	void "test find replaced card same tasks"() {
		given:
		List<Card> dayOrderCards = [new Card(group: [code: 1, tasks: [[articleCode: 1], [articleCode: 2]]])]
		Card builtCard = new Card(group: [code: 2, tasks: [[articleCode: 1], [articleCode: 2]]])

		when:
		Card replacedCard = panelService.findReplacedCard(dayOrderCards, builtCard)

		then:
		!replacedCard
	}

	void "test find replaced card one more task"() {
		given:
		List<Card> dayOrderCards = [new Card(group: [code: 1, tasks: [[articleCode: 1], [articleCode: 2]]])]
		Card builtCard = new Card(group: [code: 2, tasks: [[articleCode: 1], [articleCode: 2], [articleCode: 3]]])

		when:
		Card replacedCard = panelService.findReplacedCard(dayOrderCards, builtCard)

		then:
		replacedCard
		replacedCard.group.code == 1
		replacedCard.group.tasks.size() == 2
	}

	void "test find replaced card one less task"() {
		given:
		List<Card> dayOrderCards = [new Card(group: [code: 1, tasks: [[articleCode: 1], [articleCode: 2]]])]
		Card builtCard = new Card(group: [code: 2, tasks: [[articleCode: 1]]])

		when:
		Card replacedCard = panelService.findReplacedCard(dayOrderCards, builtCard)

		then:
		replacedCard
		replacedCard.group.code == 1
		replacedCard.group.tasks.size() == 2
	}

	void "test find replaced card completely different tasks"() {
		given:
		List<Card> dayOrderCards = [new Card(group: [code: 1, tasks: [[articleCode: 1], [articleCode: 2], [articleCode: 3], [articleCode: 4]]])]
		Card builtCard = new Card(group: [code: 2, tasks: [[articleCode: 5], [articleCode: 6], [articleCode: 7]]])

		when:
		Card replacedCard = panelService.findReplacedCard(dayOrderCards, builtCard)

		then:
		!replacedCard
	}

	// endregion

	// region updateCardGroupInfo

	void "test update card group info same groups"() {
		given:
		Card dayCard = new Card(group: [code: 1], duration: 20)
		Card builtCard = new Card(group: [code: 1], duration: 20)

		when:
		Card updatedCard = panelService.updateCardGroupInfo(dayCard, builtCard)

		then:
		updatedCard.group.code == 1
		updatedCard.duration == 20
	}

	void "test update card group info updated group"() {
		given:
		Card dayCard = new Card(group: [code: 1], duration: 20)
		Card builtCard = new Card(group: [code: 2], duration: 30)

		when:
		Card updatedCard = panelService.updateCardGroupInfo(dayCard, builtCard)

		then:
		updatedCard.group.code == 2
		updatedCard.duration == 30
	}

	// endregion

	// region handleExistentGroupCard

	void "test handle existent group card new group"() {
		given:
		UpdateCards updateCards = new UpdateCards()
		List<Card> dayOrderCards = [new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1])]
		Card builtCard = new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 2])

		when:
		boolean handled = panelService.handleExistentGroupCard(dayOrderCards, builtCard, updateCards)

		then:
		!handled
		!updateCards.updatedCards
		!updateCards.sameCards
	}

	void "test handle existent group card same group not updated card"() {
		given:
		UpdateCards updateCards = new UpdateCards()
		List<Card> dayOrderCards = [new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1])]
		Card builtCard = new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1])

		when:
		boolean handled = panelService.handleExistentGroupCard(dayOrderCards, builtCard, updateCards)

		then:
		handled
		!updateCards.updatedCards
		updateCards.sameCards.size() == 1
	}

	void "test handle existent group card same group updated card"() {
		given:
		UpdateCards updateCards = new UpdateCards()
		List<Card> dayOrderCards = [new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1])]
		Card builtCard = new Card(order: [number: 1], vehicle: [brand: 'FV'], group: [code: 1])

		when:
		boolean handled = panelService.handleExistentGroupCard(dayOrderCards, builtCard, updateCards)

		then:
		handled
		updateCards.updatedCards
		updateCards.updatedCards.size() == 1
		updateCards.updatedCards[0].vehicle.brand == 'FV'
		!updateCards.sameCards
	}

	// endregion

	// region handleReplacedGroupCard

	void "test handle replaced group card completely new group"() {
		given:
		UpdateCards updateCards = new UpdateCards()
		List<Card> dayOrderCards = [new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1])]
		Card builtCard = new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 2])

		when:
		panelService.handleReplacedGroupCard(dayOrderCards, builtCard, updateCards)

		then:
		updateCards.newCards
		updateCards.newCards.size() == 1
		updateCards.newCards[0].group.code == 2
		!updateCards.updatedCards
		!updateCards.deletedCards
	}

	void "test handle replaced group card replaced group no updated card"() {
		given:
		UpdateCards updateCards = new UpdateCards()
		List<Card> dayOrderCards = [new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1, tasks: [[articleCode: 1], [articleCode: 2]]])]
		Card builtCard = new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 2, tasks: [[articleCode: 1], [articleCode: 2], [articleCode: 3]]])

		when:
		panelService.handleReplacedGroupCard(dayOrderCards, builtCard, updateCards)

		then:
		updateCards.updatedCards
		updateCards.updatedCards.size() == 1
		updateCards.updatedCards[0].group.code == 2
		updateCards.updatedCards[0].vehicle.brand == 'BMW'
		!updateCards.newCards
		!updateCards.deletedCards
	}

	void "test handle replaced group card replaced group updated card"() {
		given:
		UpdateCards updateCards = new UpdateCards()
		List<Card> dayOrderCards = [new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1, tasks: [[articleCode: 1], [articleCode: 2]]])]
		Card builtCard = new Card(order: [number: 1], vehicle: [brand: 'FV'], group: [code: 2, tasks: [[articleCode: 1], [articleCode: 2], [articleCode: 3]]])

		when:
		panelService.handleReplacedGroupCard(dayOrderCards, builtCard, updateCards)

		then:
		updateCards.updatedCards
		updateCards.updatedCards.size() == 1
		updateCards.updatedCards[0].group.code == 2
		updateCards.updatedCards[0].vehicle.brand == 'FV'
		!updateCards.newCards
		!updateCards.deletedCards
	}

	// endregion

	// region getNewOrUpdatedCards

	void "test get new order cards new card with new group"() {
		given:
		List<Card> dayCards = [new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1])]
		List<Card> builtCards = [
				new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1]),
				new Card(order: [number: 2], vehicle: [brand: 'BMW'], group: [code: 1])
		]

		when:
		UpdateCards updateCards = panelService.getNewOrUpdatedCards(dayCards, builtCards)

		then:
		updateCards.newCards
		updateCards.newCards.size() == 1
		updateCards.newCards[0].order.number == 2
		updateCards.sameCards
		updateCards.sameCards.size() == 1
		updateCards.sameCards[0].order.number == 1
		!updateCards.updatedCards
		!updateCards.deletedCards
	}

	void "test get updated order cards no updated cards"() {
		given:
		List<Card> dayCards = [new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1])]
		List<Card> builtCards = [new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1])]

		when:
		UpdateCards updateCards = panelService.getNewOrUpdatedCards(dayCards, builtCards)

		then:
		updateCards.sameCards.size() == updateCards.getAll().size()
		updateCards.sameCards[0].order.number == 1
	}

	void "test get updated order cards updated order info card"() {
		given:
		List<Card> dayCards = [new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1])]
		List<Card> builtCards = [new Card(order: [number: 1], vehicle: [brand: 'FV'], group: [code: 1])]

		when:
		UpdateCards updateCards = panelService.getNewOrUpdatedCards(dayCards, builtCards)

		then:
		updateCards.updatedCards
		updateCards.updatedCards.size() == 1
		updateCards.updatedCards[0].order.number == 1
		updateCards.updatedCards[0].vehicle.brand == 'FV'
		updateCards.updatedCards[0].group.code == 1
		!updateCards.newCards
		!updateCards.deletedCards
		!updateCards.sameCards
	}

	void "test get updated order cards updated replaced card"() {
		given:
		List<Card> dayCards = [new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1, tasks: [[articleCode: 1], [articleCode: 2]]])]
		List<Card> builtCards = [new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 2, tasks: [[articleCode: 1]]])]

		when:
		UpdateCards updateCards = panelService.getNewOrUpdatedCards(dayCards, builtCards)

		then:
		updateCards.updatedCards
		updateCards.updatedCards.size() == 1
		updateCards.updatedCards[0].order.number == 1
		updateCards.updatedCards[0].vehicle.brand == 'BMW'
		updateCards.updatedCards[0].group.code == 2
		!updateCards.newCards
		!updateCards.deletedCards
		!updateCards.sameCards
	}

	void "test get updated order cards updated replaced card and updated order info"() {
		given:
		List<Card> dayCards = [new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1, tasks: [[articleCode: 1], [articleCode: 2]]])]
		List<Card> builtCards = [new Card(order: [number: 1], vehicle: [brand: 'FV'], group: [code: 2, tasks: [[articleCode: 1]]])]

		when:
		UpdateCards updateCards = panelService.getNewOrUpdatedCards(dayCards, builtCards)

		then:
		updateCards.updatedCards
		updateCards.updatedCards.size() == 1
		updateCards.updatedCards[0].order.number == 1
		updateCards.updatedCards[0].vehicle.brand == 'FV'
		updateCards.updatedCards[0].group.code == 2
	}

	// endregion

	// region getDeletedOrdersCards

	void "test deleted orders cards no cards to delete"() {
		given:
		List<Card> dayCards = [new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1])]

		when:
		List<Card> cards = panelService.getDeletedOrdersCards([order4Articles], dayCards)

		then:
		!cards
	}

	void "test deleted orders cards card to delete"() {
		given:
		List<Card> dayCards = [new Card(order: [number: 2], vehicle: [brand: 'BMW'], group: [code: 1])]

		when:
		List<Card> cards = panelService.getDeletedOrdersCards([order4Articles], dayCards)

		then:
		cards.size() == 1
		cards[0].order.number == 2
	}

	// endregion

	// region getUpdatedGroupCards

	void "test get updated group deleted cards no cards to delete"() {
		given:
		List<Card> dayCards = [new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1])]
		List<Card> builtCards = [new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1])]

		when:
		List<Card> cards = panelService.getUpdatedGroupDeletedCards(dayCards, builtCards)

		then:
		!cards
	}

	void "test get updated group deleted cards cards to delete"() {
		given:
		List<Card> dayCards = [new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1])]
		List<Card> builtCards = [new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 2])]

		when:
		List<Card> cards = panelService.getUpdatedGroupDeletedCards(dayCards, builtCards)

		then:
		cards.size() == 1
		cards[0].order.number == 1
		cards[0].group.code == 1
	}

	// endregion

	// region deleteCard

	void "test delete card"() {
		given:
		Card card = new Card(order: [number: 2], vehicle: [brand: 'BMW'], group: [code: 1])

		when:
		Card deletedCard = panelService.deleteCard(card)

		then:
		deletedCard.dateDeleted
	}

	// endregion

	// region getDeletedCards

	void "test get deleted cards no deleted cards"() {
		given:
		List<Card> dayCards = [new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1])]
		List<Card> builtCards = [new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1])]

		when:
		List<Card> cards = panelService.getDeletedCards([order4Articles], dayCards, builtCards)

		then:
		!cards
	}

	void "test get deleted cards deleted order deleted cards"() {
		given:
		List<Card> dayCards = [new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1])]
		List<Card> builtCards = [new Card(order: [number: 2], vehicle: [brand: 'BMW'], group: [code: 1])]

		when:
		List<Card> cards = panelService.getDeletedCards([order1Article], dayCards, builtCards)

		then:
		cards
		cards.size() == 1
		cards[0].order.number == 1
	}

	void "test get deleted cards deleted updated group deleted card"() {
		given:
		List<Card> dayCards = [new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1])]
		List<Card> builtCards = [new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 2])]

		when:
		List<Card> cards = panelService.getDeletedCards([order4Articles], dayCards, builtCards)

		then:
		cards
		cards.size() == 1
		cards[0].group.code == 1
	}

	// endregion

	// region getCardsToUpdate

	void "test handle cards no actions needed"() {
		given:
		List<Card> dayCards = [new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1])]
		List<Card> builtCards = [new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1])]

		when:
		UpdateCards updateCards = panelService.getCardsToUpdate([order4Articles], dayCards, builtCards)

		then:
		!updateCards.newCards
		!updateCards.updatedCards
		!updateCards.deletedCards
		updateCards.sameCards.size() == 1
		updateCards.sameCards[0].order.number == 1
	}

	void "test handle cards new cards"() {
		given:
		List<Card> dayCards = [new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1])]
		List<Card> builtCards = dayCards + [new Card(order: [number: 2], vehicle: [brand: 'BMW'], group: [code: 1])]

		when:
		UpdateCards updateCards = panelService.getCardsToUpdate([order4Articles, order1Article], dayCards, builtCards)

		then:
		updateCards.newCards.size() == 1
		updateCards.newCards[0].order.number == 2
		updateCards.sameCards.size() == 1
		updateCards.sameCards[0].order.number == 1
		!updateCards.updatedCards
		!updateCards.deletedCards
	}

	void "test handle cards updated cards"() {
		given:
		List<Card> dayCards = [new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1])]
		List<Card> builtCards = [new Card(order: [number: 1], vehicle: [brand: 'FV'], group: [code: 1])]

		when:
		UpdateCards updateCards = panelService.getCardsToUpdate([order4Articles], dayCards, builtCards)

		then:
		updateCards.updatedCards.size() == 1
		updateCards.updatedCards[0].order.number == 1
		updateCards.updatedCards[0].vehicle.brand == 'FV'
		!updateCards.sameCards
	}

	void "test handle cards updated new cards"() {
		given:
		List<Card> dayCards = [new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1])]
		List<Card> builtCards = [new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 2])]

		when:
		UpdateCards updateCards = panelService.getCardsToUpdate([order4Articles], dayCards, builtCards)

		then:
		updateCards.newCards.size() == 1
		updateCards.newCards[0].group.code == 2
		!updateCards.newCards[0].dateDeleted
		updateCards.deletedCards.size() == 1
		updateCards.deletedCards[0].group.code == 1
		updateCards.deletedCards[0].dateDeleted
		!updateCards.updatedCards
		!updateCards.sameCards
	}

	// endregion

}
