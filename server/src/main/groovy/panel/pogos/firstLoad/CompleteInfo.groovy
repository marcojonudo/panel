package panel.pogos.firstLoad

import com.fasterxml.jackson.annotation.JsonInclude
import groovy.transform.CompileStatic
import panel.pogos.appointmentDays.AppointmentDay
import panel.pogos.appointmentDays.AppointmentType
import panel.pogos.cards.Card
import panel.pogos.schedules.EmployeeSchedule
import panel.pogos.schedules.JobLineType
import panel.pogos.skills.Skill

@CompileStatic
class CompleteInfo {

	Map<String, List<EmployeeSchedule>> daysMechanics
	List<Skill> skills
	List<JobLineType> jobLineTypes
	List<AppointmentType> appointmentTypes
	@JsonInclude
	List<AppointmentDay> appointmentDays
	@JsonInclude
	List<Card> cards

	CompleteInfo(
		Map<String, List<EmployeeSchedule>> daysMechanics,
		List<Skill> skills,
		List<JobLineType> jobLineTypes,
		List<AppointmentType> appointmentTypes,
		List<AppointmentDay> appointmentDays,
		List<Card> cards
	) {
		this.daysMechanics = daysMechanics
		this.skills = skills
		this.jobLineTypes = jobLineTypes
		this.appointmentTypes = appointmentTypes
		this.appointmentDays = appointmentDays
		this.cards = cards
	}

}
