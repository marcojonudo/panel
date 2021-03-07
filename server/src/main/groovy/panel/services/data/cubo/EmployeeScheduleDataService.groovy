package panel.services.data.cubo


import grails.gorm.services.Query
import grails.gorm.services.Service
import grails.gorm.services.Where
import panel.domains.schedules.EmployeeSchedule
import panel.domains.schedules.JobPositionGroup

import java.time.LocalDate

@Service(EmployeeSchedule)
abstract class EmployeeScheduleDataService {

	abstract EmployeeSchedule get(Serializable id)

//	@Where({ day == day && employee == employee})
//	abstract EmployeeSchedule find(LocalDate day, Employee employee)

	abstract List<EmployeeSchedule> findAll(LocalDate day)

	@Query("""
		select $employeeSchedule.day
		from ${EmployeeSchedule employeeSchedule}
		inner join ${JobPositionGroup jobPositionGroup = employeeSchedule.jobPositionGroup}
		where $employeeSchedule.day >= $from and $employeeSchedule.schedule is not null
		and $employeeSchedule.absenceInfo is null and $employeeSchedule.workingDay = 1
		and $employeeSchedule.savedIfv = 1
		and $jobPositionGroup.code = $jobPositionGroupCode
	""")
	abstract LocalDate findFirstDay(LocalDate from, JobPositionGroup.Code jobPositionGroupCode)

	@Where({ day >= from && schedule != null && absence == null &&
				jobPositionGroup == jobPositionGroup && showInPanel == true })
	abstract List<EmployeeSchedule> findAllFrom(LocalDate from, JobPositionGroup jobPositionGroup)

	@Query("""
		select $employeeSchedule
		from ${EmployeeSchedule employeeSchedule}
		inner join ${JobPositionGroup jobPositionGroup = employeeSchedule.jobPositionGroup}
		where (($employeeSchedule.day >= $from and $employeeSchedule.schedule is not null
		and $employeeSchedule.absenceInfo is null and $employeeSchedule.workingDay = 1
		and $employeeSchedule.savedIfv = 1) or ($employeeSchedule.day is null))
		and $jobPositionGroup.code = $jobPositionGroupCode
	""")
	abstract List<EmployeeSchedule> findAll(LocalDate from, LocalDate to, JobPositionGroup.Code jobPositionGroupCode)

	abstract List<EmployeeSchedule> findAllByDayIsNull()

	abstract EmployeeSchedule save(EmployeeSchedule employeeSchedule)

	abstract EmployeeSchedule update(Serializable id, Integer lines)

	abstract EmployeeSchedule update(Serializable id, String jobLineType)

	abstract EmployeeSchedule update(Serializable id, boolean showInPanel, String panelPosition)

	abstract LocalDate findEmployeeScheduleDay(Map args)

}
