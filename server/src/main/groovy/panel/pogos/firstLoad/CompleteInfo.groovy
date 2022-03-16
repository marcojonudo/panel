package panel.pogos.firstLoad

import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.annotation.JsonInclude
import groovy.transform.CompileStatic
import groovy.transform.TupleConstructor
import panel.domains.panel.AppointmentDay
import panel.domains.panel.AppointmentType
import panel.domains.panel.Card
import panel.domains.panel.JobLineType
import panel.domains.schedules.EmployeeSchedule
import panel.domains.skills.Skill
import panel.domains.skills.SkillEmployee
import panel.pogos.ifv.getEmployees.IfvEmployee
import panel.utils.Constants

import java.time.LocalDate

@CompileStatic
@TupleConstructor
class CompleteInfo {

	@JsonInclude
	List<EmployeeSchedule> mechanics

	@JsonInclude
	List<IfvEmployee> employees
	List<Skill> skills

	@JsonInclude
	List<SkillEmployee> skillEmployees
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

}
