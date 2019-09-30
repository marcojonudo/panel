package panel.pogos

import groovy.transform.CompileStatic
import utils.pogos.panel.Card
import utils.pogos.panel.JobLineType
import utils.pogos.schedules.EmployeeSchedule

@CompileStatic
class CompleteInfo {

	Map<String, List<EmployeeSchedule>> daysMechanics
	List<JobLineType> jobLineTypes
	List<Card> cards

	CompleteInfo(
			Map<String, List<EmployeeSchedule>> daysMechanics,
			List<JobLineType> jobLineTypes,
			List<Card> cards
	) {
		this.daysMechanics = daysMechanics
		this.jobLineTypes = jobLineTypes
		this.cards = cards
	}

}
