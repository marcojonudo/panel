package panel.pogos.skills

import groovy.transform.CompileStatic
import panel.pogos.schedules.JobPositionGroup

@CompileStatic
class Skill {

	String name
	Integer expertsPercentage
	JobPositionGroup jobPositionGroup
	List<Skill> children

}
