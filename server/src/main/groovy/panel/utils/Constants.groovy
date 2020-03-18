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

	static final Map<String, String> HEADER_ID = [
	        SESSION_ID: 'session-id',
	        REAL_TIME_ACTION: 'real-time-action'
	]

	static final Map<String, String> REAL_TIME_ACTION = [
	        UPDATE_CARDS_POSITION: 'updateCardsPosition',
	        UPDATE_CARDS_DURATION: 'updateCardsDuration',
			UPDATE_CARDS_LINKS: 'updateCardsLinks',
			UPDATE_MECHANIC_JOB_LINE_TYPE: 'updateMechanicJobLineType',
			UPDATE_MECHANICS_POSITION: 'updateMechanicsPosition',
			UPDATE_MECHANIC_LINES: 'updateMechanicLines',
			CREATE_APPOINTMENT: 'createAppointment',
			UPDATE_APPOINTMENT_SCHEDULE: 'updateAppointmentSchedule'
	]

	static final List<String> ORDERS_QUERY_STATES = ['A', 'P', 'E']
	static final List<String> ECOMMERCE_APPOINTMENT_TYPE_CODES = ['ECO', 'TP']
	static final String SPAIN_TIMEZONE = "Europe/Madrid"

}
