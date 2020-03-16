package panel.utils

import groovy.transform.CompileStatic

@CompileStatic
class Constants {

	static class Url {

		static final String GET_DAY_MECHANICS = "/schedules/dayMechanics"
		static final String GET_ORDERS = "/panel/orders"
		static final String GET_CARDS = "/panel/cards"
		static final String GET_TASKS = "/panel/tasks"

	}

	class DateFormat {

		static final String yyyy_MM_dd = "yyyy-MM-dd"

	}

	static final List<String> ORDERS_QUERY_STATES = ['A', 'P', 'E']
	static final String SESSION_ID = "session-id"
	static final List<String> REAL_TIME_UPDATE_AVOID_PATHS = ['cards', 'mechanic']
	static final List<String> ECOMMERCE_APPOINTMENT_TYPE_CODES = ['ECO', 'TP']
	static final String SPAIN_TIMEZONE = "Europe/Madrid"

}
