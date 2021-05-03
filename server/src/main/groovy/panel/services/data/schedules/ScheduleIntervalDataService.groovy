package panel.services.data.schedules

import grails.gorm.services.Service
import grails.gorm.services.Where
import panel.domains.schedules.ScheduleInterval

import java.time.LocalTime

@Service(ScheduleInterval)
abstract class ScheduleIntervalDataService {

	abstract ScheduleInterval find(long id)

	abstract ScheduleInterval findScheduleInterval(LocalTime start, LocalTime end)

	@Where({ id in ids})
	abstract List<ScheduleInterval> findAll(List<Long> ids)

	abstract ScheduleInterval save(LocalTime start, LocalTime end)

	ScheduleInterval find(LocalTime start, LocalTime end) {
		return findScheduleInterval(start, end) ?: save(start, end)
	}

}
