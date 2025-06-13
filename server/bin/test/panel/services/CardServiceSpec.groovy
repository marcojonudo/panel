package panel.services

import io.micronaut.test.annotation.MockBean
import io.micronaut.test.extensions.spock.annotation.MicronautTest
import jakarta.inject.Inject
import panel.domains.Group
import panel.domains.Task
import panel.services.data.panel.GroupDurationDataService
import panel.services.data.panel.TaskDataService
import spock.lang.Specification

@MicronautTest
class CardServiceSpec extends Specification {

	// region Collaborators

	@Inject CardService cardService

	@Inject TaskDataService taskDataService
	@Inject GroupDurationDataService groupDurationDataService

	@MockBean(TaskDataService)
	TaskDataService taskDataService() {
	    Mock(TaskDataService)
	}

	@MockBean(GroupDurationDataService)
	GroupDurationDataService groupDurationDataService() {
	    Mock(GroupDurationDataService)
	}

	// endregion

	// region Variables

	Task task1 = new Task(articleCode: 1)
	Task task2 = new Task(articleCode: 2)
	Task task3 = new Task(articleCode: 3)
	Group group1 = new Group(code: 1, tasks: [task1, task2])
	Group group2 = new Group(code: 2, tasks: [task1, task3])
	Group group3 = new Group(code: 3, tasks: [task2, task3])

	// endregion

	// region Find tasks groups

	void "test find tasks groups one group with all tasks"() {
		given:
		group1.tasks = [task1, task2]
		task1.groups = [group1]
		task2.groups = [group1]

		List<Group> groups = [group1]
		List<Task> tasks = [task1, task2]

		when:
		List<Group> selectedGroups = cardService.findTasksGroups(groups, tasks)

		then:
		selectedGroups
		selectedGroups.size() == 1
		selectedGroups[0].code == group1.code
	}

	void "test find tasks groups repeated task no group for remaining task"() {
		given:
		group1.tasks = [task1, task2]
		task1.groups = [group1]
		task2.groups = [group1]

		List<Group> groups = [group1]
		List<Task> tasks = [task1, task1, task2]

		when:
		List<Group> selectedGroups = cardService.findTasksGroups(groups, tasks)

		then:
		selectedGroups
		selectedGroups.size() == 1
		selectedGroups[0].code == group1.code
		tasks.size() == 1
	}

	void "test find tasks groups repeated task existent group for remaining task"() {
		given:
		Group group2 = new Group(code: 2, tasks: [task1])
		group1.tasks = [task1, task2]
		task1.groups = [group1, group2]
		task2.groups = [group1]

		List<Group> groups = [group1, group2]
		List<Task> tasks = [task1, task1, task2]

		when:
		List<Group> selectedGroups = cardService.findTasksGroups(groups, tasks)

		then:
		selectedGroups
		selectedGroups.size() == 2
		selectedGroups[0].code == group1.code
		selectedGroups[1].code == group2.code
		!tasks
	}

	void "test find tasks groups task in two groups"() {
		given:
		Group group2 = new Group(code: 2, tasks: [task1])
		group1.tasks = [task1, task2]
		task1.groups = [group1, group2]
		task2.groups = [group1]

		List<Group> groups = [group1, group2]
		List<Task> tasks = [task1, task2]

		when:
		List<Group> selectedGroups = cardService.findTasksGroups(groups, tasks)

		then:
		selectedGroups
		selectedGroups.size() == 1
		selectedGroups[0].code == group1.code
		!tasks
	}

	void "test find tasks groups several groups "() {
		given:
		group1.tasks = [task1, task2]
		group2.tasks = [task1, task3]
		group3.tasks = [task2, task3]
		task1.groups = [group1, group2]
		task2.groups = [group1, group3]
		task3.groups = [group2, group3]

		List<Group> groups = [group1, group2, group3]
		List<Task> tasks = [task1, task2]

		when:
		List<Group> selectedGroups = cardService.findTasksGroups(groups, tasks)

		then:
		selectedGroups
		selectedGroups.size() == 1
		selectedGroups[0].code == group1.code
		!tasks
	}

	// endregion

    // region Find order groups units

//	void "test find order groups units"() {
//		given:
//		List<Group> groups = [
//		    new Group(tasks: [new Task(articleCode: 1), new Task(articleCode: 2)])
//		]
//		List<OrderLine> lines = [
//		    new OrderLine(article: new Article(code: 1, units: 1)), new OrderLine(article: new Article(code: 2, units: 1))
//		]
//
//		when:
//		List<GroupUnits> groupUnits = cardService.findOrderGroupsUnits(groups, lines, [])
//
//		then:
//		groupUnits
//	}

    // endregion

}
