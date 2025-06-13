package schedules.services.data

import grails.gorm.services.Query
import grails.gorm.services.Service
import schedules.domains.AbsenceInfo
import schedules.domains.EmployeeData
import schedules.domains.EmployeeSchedule
import schedules.domains.ScheduleInterval
import schedules.pogos.JobPositionGroupCode

import java.time.LocalDate

@Service(EmployeeSchedule)
interface EmployeeScheduleDataService {

	@Query("""
		select $employeeSchedule
		from ${EmployeeSchedule employeeSchedule}
		join ${EmployeeData data = employeeSchedule.employeeData}
		left join ${AbsenceInfo absenceInfo = employeeSchedule.absenceInfo}
		join ${ScheduleInterval interval = employeeSchedule.intervals}
		where $employeeSchedule.day >= $from and $employeeSchedule.day <= $to
		and $absenceInfo is null
		and $employeeSchedule.jobPositionGroupCode = $jobPositionGroupCode
		and $employeeSchedule.workingDay = true and $employeeSchedule.savedIfv = true
		and $employeeSchedule.dateDeleted is null
	""")
	List<EmployeeSchedule> findAll(LocalDate from, LocalDate to, JobPositionGroupCode jobPositionGroupCode)

}
