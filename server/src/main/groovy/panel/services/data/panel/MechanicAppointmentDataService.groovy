package panel.services.data.panel


import grails.gorm.services.Service
import grails.gorm.services.Where
import panel.domains.panel.MechanicAppointment
import panel.services.data.schedules.EmployeeScheduleDataService

import javax.inject.Inject
import java.time.LocalDate

@Service(MechanicAppointment)
abstract class MechanicAppointmentDataService {

	@Inject private EmployeeScheduleDataService employeeScheduleDataService

//	@Query("""
//		select $mechanicAppointment
//		from ${MechanicAppointment mechanicAppointment}
//		where $employeeSchedule.day >= $from and $employeeSchedule.day <= $to
//		and $mechanicAppointment.appointmentTypeCode in $codes
//	""")
	@Where({ mechanicId in ids && appointmentTypeCode in codes})
	abstract List<MechanicAppointment> findAll(List<Long> ids, List<String> codes)

	List<MechanicAppointment> findAll(LocalDate from, LocalDate to, List<String> codes) {
		List<Long> ids = employeeScheduleDataService.findAllIds(from, to)
		return findAll(ids, codes)
	}

}
