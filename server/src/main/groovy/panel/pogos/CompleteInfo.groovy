package panel.pogos

import com.fasterxml.jackson.annotation.JsonInclude
import groovy.transform.CompileStatic
import utils.pogos.panel.AppointmentDay
import utils.pogos.panel.Card
import utils.pogos.panel.JobLineType
import utils.pogos.panel.AppointmentType
import utils.pogos.schedules.EmployeeSchedule
import utils.pogos.skills.Skill

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
