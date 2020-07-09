package panel.pogos.skills

import groovy.transform.CompileStatic

@CompileStatic
class SkillExpertise {

	Level level

	enum Level {

		LOW(1),
		MEDIUM(2),
		HIGH(3)

		final int value

		Level(int value) {
			this.value = value
		}

	}

}
