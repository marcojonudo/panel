package panel.pogos.firstLoad

import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.annotation.JsonInclude
import groovy.transform.CompileStatic
import groovy.transform.TupleConstructor
import panel.domains.AppointmentDay
import panel.domains.AppointmentType
import panel.domains.Card
import panel.domains.JobLineType
import panel.utils.Constants

import java.time.LocalDate

@CompileStatic
@TupleConstructor
class CompleteInfo {

//	@JsonInclude
//	List<EmployeeSchedule> mechanics
//
//	@JsonInclude
//	List<IfvEmployee> employees
//	List<Skill> skills
//
//	@JsonInclude
//	List<SkillEmployee> skillEmployees
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
