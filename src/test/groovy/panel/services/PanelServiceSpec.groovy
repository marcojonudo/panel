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
import utils.pogos.EmployeeSchedule
import utils.pogos.fviberi.*
import utils.pogos.panel.Card
import utils.pogos.panel.Group
import utils.pogos.panel.GroupUnits
import utils.pogos.panel.Task

import javax.inject.Inject
import java.sql.Time

@MicronautTest
class PanelServiceSpec extends Specification {

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

	@Shared
	Order order4Articles = new Order(
			number: 1,
			timeInfo: new OrderTime(shortCode: 'C1'),
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
			timeInfo: new OrderTime(shortCode: 'C2'),
			lines: [
					new OrderLine(article: new Article(code: 1))
			],
			vehicle: new Vehicle([:])
	)

	// region loadEmployeesPosition

	void "test load employees position already defined positions"() {
		given:
		List<EmployeeSchedule> dayMechanics = [
				new EmployeeSchedule([panelInfo: [position: 'C']]),
				new EmployeeSchedule([panelInfo: [position: 'D']])
		]

		when:
		List<EmployeeSchedule> updatedMechanics = panelService.loadEmployeesPosition(dayMechanics)

		then:
		updatedMechanics.size() == 2
		updatedMechanics[0].panelInfo.position == 'C'
		updatedMechanics[1].panelInfo.position == 'D'
	}

	void "test load employees position not defined positions"() {
		given:
		List<EmployeeSchedule> dayMechanics = [
				new EmployeeSchedule([panelInfo: [:]]),
				new EmployeeSchedule([panelInfo: [:]])
		]
		schedulesDatabaseClient.updateEmployeesSchedulesPosition(dayMechanics) >> dayMechanics

		when:
		List<EmployeeSchedule> updatedMechanics = panelService.loadEmployeesPosition(dayMechanics)

		then:
		updatedMechanics.size() == 2
		updatedMechanics[0].panelInfo.position == 'A'
		updatedMechanics[1].panelInfo.position == 'B'
	}

	// endregion

	// region getDayMechanics

	void "test get day mechanics sort correct not defined positions"() {
		given:
		Date date = new Date()
		List<EmployeeSchedule> dayMechanics = [
				new EmployeeSchedule([panelInfo: [:]]),
				new EmployeeSchedule([panelInfo: [:]])
		]
		schedulesDatabaseClient.getDayMechanics(date) >> dayMechanics
		schedulesDatabaseClient.updateEmployeesSchedulesPosition(dayMechanics) >> dayMechanics

		when:
		List<EmployeeSchedule> updatedMechanics = panelService.getDayMechanics(date)

		then:
		updatedMechanics.panelInfo.position == ['A', 'B']
	}

	void "test get day mechanics sort correct already defined positions"() {
		given:
		Date date = new Date()
		List<EmployeeSchedule> dayMechanics = [
				new EmployeeSchedule([panelInfo: [position: 'B']]),
				new EmployeeSchedule([panelInfo: [position: 'A']])
		]
		schedulesDatabaseClient.getDayMechanics(date) >> dayMechanics

		when:
		List<EmployeeSchedule> updatedMechanics = panelService.getDayMechanics(date)

		then:
		updatedMechanics.panelInfo.position == ['A', 'B']
	}

	// endregion

	// region getOrderGroups

	void "test get order groups 1"() {
		given:
		List<Task> tasks = [
				new Task(articleCode: 1, groups: [new Group(code: 1), new Group(code: 5)]),
				new Task(articleCode: 2, groups: [new Group(code: 2), new Group(code: 5)]),
				new Task(articleCode: 3, groups: [new Group(code: 3)]),
				new Task(articleCode: 4, groups: [new Group(code: 4), new Group(code: 5)])
		]

		when:
		List<GroupUnits> groupUnits = panelService.getOrderGroups(order4Articles, tasks)

		then:
		groupUnits.size() == 2
		groupUnits[0].group.code == 5
		groupUnits[1].group.code == 3
	}

	void "test get order groups 2"() {
		given:
		List<Task> tasks = [
				new Task(articleCode: 1, groups: [new Group(code: 1)]),
				new Task(articleCode: 2, groups: [new Group(code: 2)]),
				new Task(articleCode: 3, groups: [new Group(code: 3)]),
				new Task(articleCode: 4, groups: [new Group(code: 4)])
		]

		when:
		List<GroupUnits> groupUnits = panelService.getOrderGroups(order4Articles, tasks)

		then:
		groupUnits.size() == 4
		groupUnits[0].group.code == 1
		groupUnits[1].group.code == 2
		groupUnits[2].group.code == 3
		groupUnits[3].group.code == 4
	}

	void "test get order groups 3"() {
		given:
		List<Task> tasks = [
				new Task(articleCode: 1, groups: [new Group(code: 1), new Group(code: 2)]),
				new Task(articleCode: 2, groups: [new Group(code: 1), new Group(code: 3)]),
				new Task(articleCode: 3, groups: [new Group(code: 2), new Group(code: 4)]),
				new Task(articleCode: 4, groups: [new Group(code: 3), new Group(code: 5)])
		]

		when:
		List<GroupUnits> groupUnits = panelService.getOrderGroups(order4Articles, tasks)

		then:
		groupUnits.size() == 3
		groupUnits[0].group.code == 1
		groupUnits[1].group.code == 4
		groupUnits[2].group.code == 5
	}

	void "test get order groups one article one absorbable task"() {
		given:
		List<Task> tasks = [
				new Task(articleCode: 1, absorbable: true, groups: [new Group(code: 1)])
		]

		when:
		List<GroupUnits> groupUnits = panelService.getOrderGroups(order1Article, tasks)

		then:
		groupUnits.size() == 1
		groupUnits[0].group.code == 1
	}

	void "test get order groups several articles several absorbable tasks"() {
		given:
		List<Task> tasks = [
				new Task(articleCode: 1, groups: [new Group(code: 1)]),
				new Task(articleCode: 2, absorbable: true, groups: [new Group(code: 1)]),
				new Task(articleCode: 3, absorbable: true, groups: [new Group(code: 1)]),
				new Task(articleCode: 4, absorbable: true, groups: [new Group(code: 1)])
		]

		when:
		List<GroupUnits> groupUnits = panelService.getOrderGroups(order4Articles, tasks)

		then:
		groupUnits.size() == 1
		groupUnits[0].group.code == 1
	}

	// endregion

	// region buildOrdersCards

	void "test build order cards 1"() {
		given:
		GroupUnits groupUnits = new GroupUnits(new Group(code: 1, shortName: 'ABC'), [1])
		Map<Order, List<GroupUnits>> ordersGroups = [
				(order1Article): [groupUnits]
		]
		panelDatabaseClient.getDurations([groupUnits]) >> [30]

		when:
		List<Card> cards = panelService.buildOrdersCards(ordersGroups)

		then:
		cards.size() == 1
		cards[0].orderInfo.number == order1Article.number
		cards[0].orderInfo.code == order1Article.timeInfo.shortCode
		cards[0].code == 'ABC'
		cards[0].group.code == 1
		cards[0].status == Card.Status.DEFAULT
		cards[0].duration == new Time(0, 30, 0)
	}

	void "test build order cards 2"() {
		given:
		GroupUnits groupUnits1 = new GroupUnits(new Group(code: 1), [1])
		GroupUnits groupUnits2 = new GroupUnits(new Group(code: 2), [1, 1])
		GroupUnits groupUnits3 = new GroupUnits(new Group(code: 3), [3])
		Map<Order, List<GroupUnits>> ordersGroups = [
				(order1Article): [groupUnits1],
				(order4Articles): [groupUnits1, groupUnits2, groupUnits3]
		]
		panelDatabaseClient.getDurations([groupUnits1, groupUnits1, groupUnits2, groupUnits3]) >> [10, 10, 45, 20]

		when:
		List<Card> cards = panelService.buildOrdersCards(ordersGroups)

		then:
		cards.size() == 4
		cards[0].orderInfo.number == order1Article.number
		cards[0].group.code == 1
		cards[0].duration == new Time(0, 10, 0)
		cards[1].orderInfo.number == order4Articles.number
		cards[1].group.code == 1
		cards[1].duration == new Time(0, 10, 0)
		cards[2].orderInfo.number == order4Articles.number
		cards[2].group.code == 2
		cards[2].duration == new Time(0, 45, 0)
		cards[3].orderInfo.number == order4Articles.number
		cards[3].group.code == 3
		cards[3].duration == new Time(0, 20, 0)
	}

	void "test build order cards duration not found for group"() {
		given:
		GroupUnits groupUnits1 = new GroupUnits(new Group(code: 1), [1])
		Map<Order, List<GroupUnits>> ordersGroups = [
				(order1Article): [groupUnits1]
		]
		panelDatabaseClient.getDurations([groupUnits1]) >> []

		when:
		List<Card> cards = panelService.buildOrdersCards(ordersGroups)

		then:
		!cards
	}

	// endregion

	// region checkUpdatedOrderInfo

	void "test check updated card same fields"() {
		given:
		Card builtCard = new Card(orderInfo: [number: 1, vehicleInfo: [brand: 'FV']], mechanicCode: '1', status: Card.Status.TEMPORAL)
		Card dayCard = new Card(orderInfo: [number: 1, vehicleInfo: [brand: 'FV']], mechanicCode: '1', status: Card.Status.TEMPORAL)

		when:
		boolean updated = panelService.checkUpdatedOrderInfo(dayCard, builtCard)

		then:
		!updated
	}

	void "test check updated card updated order info"() {
		given:
		Card builtCard = new Card(orderInfo: [number: 1, code: 'C1', vehicleInfo: [brand: 'FV']])
		Card dayCard = new Card(orderInfo: [number: 1, code: 'C2', vehicleInfo: [brand: 'FV']])

		when:
		boolean updated = panelService.checkUpdatedOrderInfo(dayCard, builtCard)

		then:
		updated
	}

	void "test check updated card updated vehicle info"() {
		given:
		Card builtCard = new Card(orderInfo: [number: 1, vehicleInfo: [brand: 'FV']])
		Card dayCard = new Card(orderInfo: [number: 1, vehicleInfo: [brand: 'BMW']])

		when:
		boolean updated = panelService.checkUpdatedOrderInfo(dayCard, builtCard)

		then:
		updated
	}

	// endregion

	// region updateCardOrderInfo

	void "test update card order info"() {
		given:
		Card dayCard = new Card(orderInfo: [number: 1, state: 'A', vehicleInfo: [brand: 'BMW']])
		Card builtCard = new Card(orderInfo: [number: 1, state: 'V', vehicleInfo: [brand: 'FV']])

		when:
		Card updatedDayCard = panelService.updateCardOrderInfo(dayCard, builtCard)

		then:
		updatedDayCard.orderInfo.vehicleInfo.brand == 'FV'
		updatedDayCard.orderInfo.state == 'V'
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
		Card dayCard = new Card(group: [code: 1], duration: new Time(0, 20, 0))
		Card builtCard = new Card(group: [code: 1], duration: new Time(0, 20, 0))

		when:
		Card updatedCard = panelService.updateCardGroupInfo(dayCard, builtCard)

		then:
		updatedCard.group.code == 1
		updatedCard.duration == new Time(0, 20, 0)
	}

	void "test update card group info updated group"() {
		given:
		Card dayCard = new Card(group: [code: 1], duration: new Time(0, 20, 0))
		Card builtCard = new Card(group: [code: 2], duration: new Time(0, 30, 0))

		when:
		Card updatedCard = panelService.updateCardGroupInfo(dayCard, builtCard)

		then:
		updatedCard.group.code == 2
		updatedCard.duration == new Time(0, 30, 0)
	}

	// endregion

	// region handleExistentGroupCard

	void "test handle existent group card new group"() {
		given:
		UpdateCards updateCards = new UpdateCards()
		List<Card> dayOrderCards = [new Card(orderInfo: [number: 1, vehicleInfo: [brand: 'BMW']], group: [code: 1])]
		Card builtCard = new Card(orderInfo: [number: 1, vehicleInfo: [brand: 'BMW']], group: [code: 2])

		when:
		boolean handled = panelService.handleExistentGroupCard(dayOrderCards, builtCard, updateCards)

		then:
		!handled
		!updateCards.updatedCards
	}

	void "test handle existent group card same group not updated card"() {
		given:
		UpdateCards updateCards = new UpdateCards()
		List<Card> dayOrderCards = [new Card(orderInfo: [number: 1, vehicleInfo: [brand: 'BMW']], group: [code: 1])]
		Card builtCard = new Card(orderInfo: [number: 1, vehicleInfo: [brand: 'BMW']], group: [code: 1])

		when:
		boolean handled = panelService.handleExistentGroupCard(dayOrderCards, builtCard, updateCards)

		then:
		handled
		!updateCards.updatedCards
	}

	void "test handle existent group card same group updated card"() {
		given:
		UpdateCards updateCards = new UpdateCards()
		List<Card> dayOrderCards = [new Card(orderInfo: [number: 1, vehicleInfo: [brand: 'BMW']], group: [code: 1])]
		Card builtCard = new Card(orderInfo: [number: 1, vehicleInfo: [brand: 'FV']], group: [code: 1])

		when:
		boolean handled = panelService.handleExistentGroupCard(dayOrderCards, builtCard, updateCards)

		then:
		handled
		updateCards.updatedCards
		updateCards.updatedCards.size() == 1
		updateCards.updatedCards[0].orderInfo.vehicleInfo.brand == 'FV'
	}

	// endregion

	// region handleReplacedGroupCard

	void "test handle replaced group card completely new group"() {
		given:
		UpdateCards updateCards = new UpdateCards()
		List<Card> dayOrderCards = [new Card(orderInfo: [number: 1, vehicleInfo: [brand: 'BMW']], group: [code: 1])]
		Card builtCard = new Card(orderInfo: [number: 1, vehicleInfo: [brand: 'BMW']], group: [code: 2])

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
		List<Card> dayOrderCards = [new Card(orderInfo: [number: 1, vehicleInfo: [brand: 'BMW']], group: [code: 1, tasks: [[articleCode: 1], [articleCode: 2]]])]
		Card builtCard = new Card(orderInfo: [number: 1, vehicleInfo: [brand: 'BMW']], group: [code: 2, tasks: [[articleCode: 1], [articleCode: 2], [articleCode: 3]]])

		when:
		panelService.handleReplacedGroupCard(dayOrderCards, builtCard, updateCards)

		then:
		updateCards.updatedCards
		updateCards.updatedCards.size() == 1
		updateCards.updatedCards[0].group.code == 2
		updateCards.updatedCards[0].orderInfo.vehicleInfo.brand == 'BMW'
		!updateCards.newCards
		!updateCards.deletedCards
	}

	void "test handle replaced group card replaced group updated card"() {
		given:
		UpdateCards updateCards = new UpdateCards()
		List<Card> dayOrderCards = [new Card(orderInfo: [number: 1, vehicleInfo: [brand: 'BMW']], group: [code: 1, tasks: [[articleCode: 1], [articleCode: 2]]])]
		Card builtCard = new Card(orderInfo: [number: 1, vehicleInfo: [brand: 'FV']], group: [code: 2, tasks: [[articleCode: 1], [articleCode: 2], [articleCode: 3]]])

		when:
		panelService.handleReplacedGroupCard(dayOrderCards, builtCard, updateCards)

		then:
		updateCards.updatedCards
		updateCards.updatedCards.size() == 1
		updateCards.updatedCards[0].group.code == 2
		updateCards.updatedCards[0].orderInfo.vehicleInfo.brand == 'FV'
		!updateCards.newCards
		!updateCards.deletedCards
	}

	// endregion

	// region getNewOrUpdatedCards

	void "test get new order cards new card with new group"() {
		given:
		List<Card> dayCards = [new Card(orderInfo: [number: 1, vehicleInfo: [brand: 'BMW']], group: [code: 1])]
		List<Card> builtCards = [
				new Card(orderInfo: [number: 1, vehicleInfo: [brand: 'BMW']], group: [code: 1]),
				new Card(orderInfo: [number: 2, vehicleInfo: [brand: 'BMW']], group: [code: 1])
		]

		when:
		UpdateCards updateCards = panelService.getNewOrUpdatedCards(dayCards, builtCards)

		then:
		updateCards.newCards
		updateCards.newCards.size() == 1
		updateCards.newCards[0].orderInfo.number == 2
		!updateCards.updatedCards
		!updateCards.deletedCards
	}

	void "test get updated order cards no updated cards"() {
		given:
		List<Card> dayCards = [new Card(orderInfo: [number: 1, vehicleInfo: [brand: 'BMW']], group: [code: 1])]
		List<Card> builtCards = [new Card(orderInfo: [number: 1, vehicleInfo: [brand: 'BMW']], group: [code: 1])]

		when:
		UpdateCards updateCards = panelService.getNewOrUpdatedCards(dayCards, builtCards)

		then:
		!updateCards.getAll()
	}

	void "test get updated order cards updated order info card"() {
		given:
		List<Card> dayCards = [new Card(orderInfo: [number: 1, vehicleInfo: [brand: 'BMW']], group: [code: 1])]
		List<Card> builtCards = [new Card(orderInfo: [number: 1, vehicleInfo: [brand: 'FV']], group: [code: 1])]

		when:
		UpdateCards updateCards = panelService.getNewOrUpdatedCards(dayCards, builtCards)

		then:
		updateCards.updatedCards
		updateCards.updatedCards.size() == 1
		updateCards.updatedCards[0].orderInfo.number == 1
		updateCards.updatedCards[0].orderInfo.vehicleInfo.brand == 'FV'
		updateCards.updatedCards[0].group.code == 1
		!updateCards.newCards
		!updateCards.deletedCards
	}

	void "test get updated order cards updated replaced card"() {
		given:
		List<Card> dayCards = [new Card(orderInfo: [number: 1, vehicleInfo: [brand: 'BMW']], group: [code: 1, tasks: [[articleCode: 1], [articleCode: 2]]])]
		List<Card> builtCards = [new Card(orderInfo: [number: 1, vehicleInfo: [brand: 'BMW']], group: [code: 2, tasks: [[articleCode: 1]]])]

		when:
		UpdateCards updateCards = panelService.getNewOrUpdatedCards(dayCards, builtCards)

		then:
		updateCards.updatedCards
		updateCards.updatedCards.size() == 1
		updateCards.updatedCards[0].orderInfo.number == 1
		updateCards.updatedCards[0].orderInfo.vehicleInfo.brand == 'BMW'
		updateCards.updatedCards[0].group.code == 2
		!updateCards.newCards
		!updateCards.deletedCards
	}

	void "test get updated order cards updated replaced card and updated order info"() {
		given:
		List<Card> dayCards = [new Card(orderInfo: [number: 1, vehicleInfo: [brand: 'BMW']], group: [code: 1, tasks: [[articleCode: 1], [articleCode: 2]]])]
		List<Card> builtCards = [new Card(orderInfo: [number: 1, vehicleInfo: [brand: 'FV']], group: [code: 2, tasks: [[articleCode: 1]]])]

		when:
		UpdateCards updateCards = panelService.getNewOrUpdatedCards(dayCards, builtCards)

		then:
		updateCards.updatedCards
		updateCards.updatedCards.size() == 1
		updateCards.updatedCards[0].orderInfo.number == 1
		updateCards.updatedCards[0].orderInfo.vehicleInfo.brand == 'FV'
		updateCards.updatedCards[0].group.code == 2
	}

	// endregion

	// region getDeletedOrdersCards

	void "test deleted orders cards no cards to delete"() {
		given:
		List<Card> dayCards = [new Card(orderInfo: [number: 1, vehicleInfo: [brand: 'BMW']], group: [code: 1])]

		when:
		List<Card> cards = panelService.getDeletedOrdersCards([order4Articles], dayCards)

		then:
		!cards
	}

	void "test deleted orders cards card to delete"() {
		given:
		List<Card> dayCards = [new Card(orderInfo: [number: 2, vehicleInfo: [brand: 'BMW']], group: [code: 1])]

		when:
		List<Card> cards = panelService.getDeletedOrdersCards([order4Articles], dayCards)

		then:
		cards.size() == 1
		cards[0].orderInfo.number == 2
	}

	// endregion

	// region getUpdatedGroupCards

	void "test get updated group deleted cards no cards to delete"() {
		given:
		List<Card> dayCards = [new Card(orderInfo: [number: 1, vehicleInfo: [brand: 'BMW']], group: [code: 1])]
		List<Card> builtCards = [new Card(orderInfo: [number: 1, vehicleInfo: [brand: 'BMW']], group: [code: 1])]

		when:
		List<Card> cards = panelService.getUpdatedGroupDeletedCards(dayCards, builtCards)

		then:
		!cards
	}

	void "test get updated group deleted cards cards to delete"() {
		given:
		List<Card> dayCards = [new Card(orderInfo: [number: 1, vehicleInfo: [brand: 'BMW']], group: [code: 1])]
		List<Card> builtCards = [new Card(orderInfo: [number: 1, vehicleInfo: [brand: 'BMW']], group: [code: 2])]

		when:
		List<Card> cards = panelService.getUpdatedGroupDeletedCards(dayCards, builtCards)

		then:
		cards.size() == 1
		cards[0].orderInfo.number == 1
		cards[0].group.code == 1
	}

	// endregion

	// region deleteCard

	void "test delete card"() {
		given:
		Card card = new Card(orderInfo: [number: 2, vehicleInfo: [brand: 'BMW']], group: [code: 1])

		when:
		Card deletedCard = panelService.deleteCard(card)

		then:
		deletedCard.dateDeleted
	}

	// endregion

	// region getDeletedCards

	void "test get deleted cards no deleted cards"() {
		given:
		List<Card> dayCards = [new Card(orderInfo: [number: 1, vehicleInfo: [brand: 'BMW']], group: [code: 1])]
		List<Card> builtCards = [new Card(orderInfo: [number: 1, vehicleInfo: [brand: 'BMW']], group: [code: 1])]

		when:
		List<Card> cards = panelService.getDeletedCards([order4Articles], dayCards, builtCards)

		then:
		!cards
	}

	void "test get deleted cards deleted order deleted cards"() {
		given:
		List<Card> dayCards = [new Card(orderInfo: [number: 1, vehicleInfo: [brand: 'BMW']], group: [code: 1])]
		List<Card> builtCards = [new Card(orderInfo: [number: 2, vehicleInfo: [brand: 'BMW']], group: [code: 1])]

		when:
		List<Card> cards = panelService.getDeletedCards([order1Article], dayCards, builtCards)

		then:
		cards
		cards.size() == 1
		cards[0].orderInfo.number == 1
	}

	void "test get deleted cards deleted updated group deleted card"() {
		given:
		List<Card> dayCards = [new Card(orderInfo: [number: 1, vehicleInfo: [brand: 'BMW']], group: [code: 1])]
		List<Card> builtCards = [new Card(orderInfo: [number: 1, vehicleInfo: [brand: 'BMW']], group: [code: 2])]

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
		List<Card> dayCards = [new Card(orderInfo: [number: 1, vehicleInfo: [brand: 'BMW']], group: [code: 1])]
		List<Card> builtCards = [new Card(orderInfo: [number: 1, vehicleInfo: [brand: 'BMW']], group: [code: 1])]

		when:
		UpdateCards updateCards = panelService.getCardsToUpdate([order4Articles], dayCards, builtCards)

		then:
		!updateCards.newCards
		!updateCards.updatedCards
		!updateCards.deletedCards
	}

	void "test handle cards new cards"() {
		given:
		List<Card> dayCards = [new Card(orderInfo: [number: 1, vehicleInfo: [brand: 'BMW']], group: [code: 1])]
		List<Card> builtCards = dayCards + [new Card(orderInfo: [number: 2, vehicleInfo: [brand: 'BMW']], group: [code: 1])]

		when:
		UpdateCards updateCards = panelService.getCardsToUpdate([order4Articles, order1Article], dayCards, builtCards)

		then:
		updateCards.newCards.size() == 1
		updateCards.newCards[0].orderInfo.number == 2
		!updateCards.updatedCards
		!updateCards.deletedCards
	}

	void "test handle cards updated cards"() {
		given:
		List<Card> dayCards = [new Card(orderInfo: [number: 1, vehicleInfo: [brand: 'BMW']], group: [code: 1])]
		List<Card> builtCards = [new Card(orderInfo: [number: 1, vehicleInfo: [brand: 'FV']], group: [code: 1])]

		when:
		UpdateCards updateCards = panelService.getCardsToUpdate([order4Articles], dayCards, builtCards)

		then:
		updateCards.updatedCards.size() == 1
		updateCards.updatedCards[0].orderInfo.number == 1
		updateCards.updatedCards[0].orderInfo.vehicleInfo.brand == 'FV'
	}

	void "test handle cards updated new cards"() {
		given:
		List<Card> dayCards = [new Card(orderInfo: [number: 1, vehicleInfo: [brand: 'BMW']], group: [code: 1])]
		List<Card> builtCards = [new Card(orderInfo: [number: 1, vehicleInfo: [brand: 'BMW']], group: [code: 2])]

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
	}

	// endregion

}
