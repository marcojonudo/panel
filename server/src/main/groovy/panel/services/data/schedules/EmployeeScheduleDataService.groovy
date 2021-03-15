package panel.services.data.schedules

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
		select $employeeSchedule.id
		from ${EmployeeSchedule employeeSchedule}
		where $employeeSchedule.day >= $from and $employeeSchedule.day <= $to
	""")
	abstract List<Long> findAllIds(LocalDate from, LocalDate to)

	@Where({ id in ids})
	abstract List<EmployeeSchedule> findAll(List<Long> ids)

	@Where({ day >= from && day <= to && workingDay == true && savedIfv == true && absenceInfo == null && dateDeleted == null && jobPositionGroupCode == jobPositionGroupCode})
	abstract List<EmployeeSchedule> findAllEmployeeSchedules(
		LocalDate from, LocalDate to, JobPositionGroup.Code jobPositionGroupCode
	)

	List<EmployeeSchedule> findAll(LocalDate from, LocalDate to, JobPositionGroup.Code jobPositionGroupCode) {
		return findAllEmployeeSchedules(from, to, jobPositionGroupCode).findAll { it.intervals }
	}

	abstract List<EmployeeSchedule> findAllByDayIsNull()

	abstract EmployeeSchedule save(EmployeeSchedule employeeSchedule)

//	abstract EmployeeSchedule update(Serializable id, Integer lines)

//	abstract EmployeeSchedule update(Serializable id, String jobLineType)

//	abstract EmployeeSchedule update(Serializable id, boolean showInPanel, String panelPosition)

	abstract LocalDate findEmployeeScheduleDay(Map args)

}
