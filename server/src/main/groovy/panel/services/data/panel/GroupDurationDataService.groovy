package panel.services.data.panel


import grails.gorm.services.Query
import grails.gorm.services.Service
import panel.domains.panel.Group
import panel.domains.panel.GroupDuration
import panel.domains.panel.Task
import panel.pogos.cards.GroupUnits

@Service(GroupDuration)
abstract class GroupDurationDataService {

	@Query("""
		select $groupDuration
		from ${GroupDuration groupDuration}
		inner join ${Group group = groupDuration.group}
		where $group.id = $groupId and $groupDuration.units = $units
	""")
	abstract GroupDuration find(long groupId, int units)

	@Query("""
		select $groupDuration
		from ${GroupDuration groupDuration}
		inner join ${Group group = groupDuration.group}
		inner join ${Task task = groupDuration.task}
		where $group.id = $groupId and $task.id = $taskId and $groupDuration.units = $units
	""")
	abstract GroupDuration find(long groupId, long taskId, int units)

	List<GroupUnits> findAll(List<GroupUnits> groupsUnits) {
		groupsUnits.each {
			Float duration
			GroupDuration groupDuration = find(it.group.id, it.units[0] as int)
			if (groupDuration) {
				it.duration = (int)(5 * Math.round(groupDuration.duration/5))
			} else {
				groupDuration = find(it.group.id, 1)
				if (groupDuration) {
					duration = (float) groupDuration.duration * it.units[0]
					it.duration = (int)(5 * Math.round(duration/5))
				} else {
					List<Long> tasksIds = it.group.tasks.sort { it.articleCode }.id
					List<Float> durations = [tasksIds, it.units].transpose().collect { long taskId, float units ->
						groupDuration = find(it.group.id, taskId, units as int)
						return groupDuration.duration * units
					}
					duration = (float) durations.sum()
					it.duration = (int)(5 * Math.round(duration/5))
				}
			}
		}

		return groupsUnits
	}

}
