package panel.services.data.schedules

import grails.gorm.services.Query
import grails.gorm.services.Service
import grails.gorm.services.Where
import panel.domains.schedules.AbsenceInfo
import panel.domains.schedules.EmployeeData
import panel.domains.schedules.EmployeeSchedule
import panel.domains.schedules.JobPositionGroup

import java.time.LocalDate

@Service(EmployeeSchedule)
abstract class EmployeeScheduleDataService {

	@Where({ day == day && employeeData.code == code })
	abstract EmployeeSchedule find(LocalDate day, String code)

	abstract List<EmployeeSchedule> findAll(LocalDate day)

	@Query("""
		select $employeeSchedule.id
		from ${EmployeeSchedule employeeSchedule}
		where $employeeSchedule.day >= $from and $employeeSchedule.day <= $to
	""")
	abstract List<Long> findAllIds(LocalDate from, LocalDate to)

	@Where({ id in ids })
	abstract List<EmployeeSchedule> findAll(List<Long> ids)

	@Query("""
		select $employeeSchedule
		from ${EmployeeSchedule employeeSchedule}
		join ${EmployeeData data = employeeSchedule.employeeData}
		left join ${AbsenceInfo absenceInfo = employeeSchedule.absenceInfo}
		where $employeeSchedule.day >= $from and $employeeSchedule.day <= $to
		and $absenceInfo is null
		and $employeeSchedule.jobPositionGroupCode = $jobPositionGroupCode
		and $employeeSchedule.workingDay = 1 and $employeeSchedule.savedIfv = 1
		and $employeeSchedule.dateDeleted is null
	""")
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
