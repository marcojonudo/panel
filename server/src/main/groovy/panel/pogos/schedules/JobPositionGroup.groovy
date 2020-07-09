package panel.pogos.schedules

import groovy.transform.CompileStatic

@CompileStatic
class JobPositionGroup {

	String code
	String name
	String color

	enum JobPositionGroupCode {

		GARAGE, SHOP, CASH, MANAGER

	}

}
