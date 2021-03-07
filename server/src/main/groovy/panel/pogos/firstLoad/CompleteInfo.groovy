package panel.pogos.firstLoad

import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.annotation.JsonInclude
import groovy.transform.CompileStatic
import panel.domains.cubo.Employee
import panel.domains.cubo.EmployeeSchedule
import panel.domains.panel.AppointmentDay
import panel.domains.panel.AppointmentType
import panel.domains.panel.Card
import panel.domains.panel.JobLineType
import panel.domains.skills.Skill
import panel.utils.Constants

import java.time.LocalDate

@CompileStatic
class CompleteInfo {

	Map<String, List<EmployeeSchedule>> daysMechanics
	List<Employee> employees
	List<Skill> skills
	List<JobLineType> jobLineTypes
	List<AppointmentType> appointmentTypes
	@JsonFormat(pattern = Constants.DateFormat.yyyy_MM_dd, timezone = Constants.SPAIN_TIMEZONE)
	LocalDate firstScheduleDay
	@JsonFormat(pattern = Constants.DateFormat.yyyy_MM_dd, timezone = Constants.SPAIN_TIMEZONE)
	LocalDate lastScheduleDay
	@JsonInclude
	List<AppointmentDay> appointmentDays
	@JsonInclude
	List<Card> cards

	CompleteInfo(
		Map<String, List<EmployeeSchedule>> daysMechanics,
		List<Employee> employees,
		List<Skill> skills,
		List<JobLineType> jobLineTypes,
		List<AppointmentType> appointmentTypes,
		LocalDate firstScheduleDay,
		LocalDate lastScheduleDay,
		List<AppointmentDay> appointmentDays,
		List<Card> cards
	) {
		this.daysMechanics = daysMechanics
		this.employees = employees
		this.skills = skills
		this.jobLineTypes = jobLineTypes
		this.appointmentTypes = appointmentTypes
		this.firstScheduleDay = firstScheduleDay
		this.lastScheduleDay = lastScheduleDay
		this.appointmentDays = appointmentDays
		this.cards = cards
	}

}
