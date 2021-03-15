package panel.services.data.schedules

import grails.gorm.services.Service
import grails.gorm.services.Where
import panel.domains.schedules.ScheduleInterval

@Service(ScheduleInterval)
interface ScheduleIntervalDataService {

	@Where({ id in ids})
	List<ScheduleInterval> findAll(List<Long> ids)

}
