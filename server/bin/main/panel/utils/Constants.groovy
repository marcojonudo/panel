package panel.utils

import groovy.transform.CompileStatic
import panel.pogos.fviberi.Order
import panel.domains.AppointmentType

@CompileStatic
class Constants {

	class DateFormat {

		static final String yyyy_MM_dd = "yyyy-MM-dd"
		static final String dd_MM_yyyy = "dd-MM-yyyy"
		static final String dd_MM_yyyy_SLASH = "dd/MM/yyyy"

	}

	class TimeFormat {

		static final String HH_mm = "HH:mm"
		static final String HH_mm_ss = "HH:mm:ss"

	}

	static class DateTimeFormat {

		static final String yyyy_MM_dd_HH_mm_ss = "yyyy-MM-dd HH:mm:ss"
		static final String yyyy_MM_dd_T_hh_MM_ss_Z = "yyyy-MM-dd'T'HH:mm:ss'Z'"

	}

	static class Message {

		static final String GET_EMPLOYEES_IFV_WRONG_REQUEST = "Error requesting employees to IFV"
		static final String NOT_FOUND_ARTICLE = "Article not found in DB"
		static final String NOT_FOUND_DURATION = "Duration not found for group"

	}

	static class ExceptionMessage {

		static final String GET_IFV_TOKEN = "Error requesting token to IFV"
		static final String IFV_REQUEST_ERROR = "IFV request error"

	}

	static class DataSource {

		static final String SCHEDULES = "schedules"
		static final String FVIBERI = "fviberi"
		static final String CUBO = "cubo"
		static final String LOCALHOST = "localhost"

	}

	static final Map<String, String> HEADER_ID = [
		SESSION_ID: 'session-id',
		REAL_TIME_ACTION: 'real-time-action'
	]

	static final List<Order.State> ORDERS_QUERY_STATES = [
		Order.State.A, Order.State.P, Order.State.E
	]
	static final List<AppointmentType.Code> ECOMMERCE_CARD_APPOINTMENT_TYPE_CODES = [
		AppointmentType.Code.ECO, AppointmentType.Code.TP, AppointmentType.Code.RAP_CRF
	]
	static final List<String> RESET_NEW_CARDS_PROPERTIES = ['day', 'created']
	static final String SPAIN_TIMEZONE = "Europe/Madrid"
	static final int DAYS_LOAD = 7
	static final String IFV_GET_CENTRE_SCHEDULE_SERVICE = "HorariosCentroJsonController"
	static final String NON_EXISTENT_CARD = "Ficha no encontrada: "
	static final String OPERATION_SUCCESS = "Operación completada con éxito"
	static final String ECOMMERCE_USER_CODE = "9999997"
	static final String SPV_ID = "799"
	static final int ROUND_NUMBER = 5
	static final String FIRST_MECHANIC_POSITION = "A"

	class SellerCode {

		static final String CECOTEC = "9999996"

	}

}
