package panel.utils

import groovy.transform.CompileStatic

@CompileStatic
class Constants {

	static class Url {

		static final String GET_DAY_MECHANICS = "/schedules/dayMechanics"
		static final String UPDATE_EMPLOYEES_SCHEDULES_POSITION = "/schedules/employeesSchedulesPosition"
		static final String GET_ORDERS = "/panel/orders"
		static final String GET_CARDS = "/panel/cards"
		static final String GET_TASKS = "/panel/tasks"
		static final String GET_DURATIONS = "/panel/durations"

	}

	static final List<String> A_Z = 'A'..'Z'
	static final List<String> ORDERS_QUERY_STATES = ['A', 'P', 'E']

}
