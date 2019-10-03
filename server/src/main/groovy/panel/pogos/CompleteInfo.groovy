package panel.pogos

import groovy.transform.CompileStatic
import utils.pogos.panel.Card
import utils.pogos.panel.JobLineType
import utils.pogos.schedules.EmployeeSchedule
import utils.pogos.skills.Skill

@CompileStatic
class CompleteInfo {

	Map<String, List<EmployeeSchedule>> daysMechanics
	List<Skill> skills
	List<JobLineType> jobLineTypes
	List<Card> cards

	CompleteInfo(
			Map<String, List<EmployeeSchedule>> daysMechanics,
			List<Skill> skills,
			List<JobLineType> jobLineTypes,
			List<Card> cards
	) {
		this.daysMechanics = daysMechanics
		this.skills = skills
		this.jobLineTypes = jobLineTypes
		this.cards = cards
	}

}
