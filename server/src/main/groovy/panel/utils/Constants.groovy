package panel.utils

import groovy.transform.CompileStatic
import panel.domains.fviberi.OrderHeader
import panel.pogos.appointmentDays.AppointmentType.AppointmentTypeCode

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

	}

	static class Message {

		static final String GET_EMPLOYEES_IFV_WRONG_REQUEST = "Error requesting employees to IFV"

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

	static final Map<String, String> REAL_TIME_ACTION = [
		UPDATE_CARDS_POSITION: 'updateCardsPosition',
		UPDATE_CARDS_DURATION: 'updateCardsDuration',
		UPDATE_CARDS_LINKS: 'updateCardsLinks',
		RESET_CARDS_LINKS: 'resetCardsLinks',
		DELETE_CARDS: 'deleteCards',
		UPDATE_MECHANIC_JOB_LINE_TYPE: 'updateMechanicJobLineType',
		UPDATE_MECHANICS_POSITION: 'updateMechanicsPosition',
		UPDATE_MECHANIC_LINES: 'updateMechanicLines',
		CREATE_APPOINTMENT: 'createAppointment',
		UPDATE_APPOINTMENT_SCHEDULE: 'updateAppointmentSchedule',
		DELETE_APPOINTMENT: 'deleteAppointment',
		SYNC_JPDV: 'syncJpdv',
		UPDATE_VEHICLE_POSITION: 'updateVehiclePosition',
		UPDATE_PENDING_CALL: 'updatePendingCall',
		UPDATE_PENDING_BUDGET: 'updatePendingBudget',
		DIVIDE_CARDS: 'divideCards',
		CREATE_CARDS: 'createCards',
	]

	static final List<OrderHeader.State> ORDERS_QUERY_STATES = [
		OrderHeader.State.A, OrderHeader.State.P, OrderHeader.State.E
	]
	static final List<AppointmentTypeCode> ECOMMERCE_CARD_APPOINTMENT_TYPE_CODES = [
		AppointmentTypeCode.ECO, AppointmentTypeCode.TP, AppointmentTypeCode.RAP_CRF
	]
	static final List<String> RESET_NEW_CARDS_PROPERTIES = ['day', 'created']
	static final String SPAIN_TIMEZONE = "Europe/Madrid"
	static final int DAYS_LOAD = 7
	static final String IFV_GET_CENTRE_SCHEDULE_SERVICE = "HorariosCentroJsonController"
	static final String NON_EXISTENT_CARD = "Ficha no encontrada: "
	static final String OPERATION_SUCCESS = "Operación completada con éxito"
	static final String ECOMMERCE_USER_CODE = "9999997"
	static final String SPV_ID = "799"

}
