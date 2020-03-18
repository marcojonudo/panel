package panel.controllers

import groovy.transform.CompileStatic
import io.micronaut.http.annotation.*
import io.micronaut.http.sse.Event
import io.reactivex.subjects.PublishSubject
import panel.clients.cubo.CuboDatabaseClient
import panel.clients.panel.PanelDatabaseClient
import panel.pogos.CompleteInfo
import panel.pogos.MechanicAppointment
import panel.pogos.realTime.RealTimeRequestInfo
import panel.publisher.PanelPublisher
import panel.services.PanelService
import panel.utils.Constants
import utils.pogos.panel.Card
import utils.pogos.schedules.EmployeeSchedule
import utils.pogos.schedules.EmployeeScheduleAppointment

@CompileStatic
@Controller("/panel")
class PanelController {

	private final PanelService panelService
	private final PanelDatabaseClient panelDatabaseClient
	private final CuboDatabaseClient cuboDatabaseClient

	PanelController(
			PanelService panelService,
			PanelDatabaseClient panelDatabaseClient,
			CuboDatabaseClient cuboDatabaseClient
	) {
		this.panelService = panelService
		this.panelDatabaseClient = panelDatabaseClient
		this.cuboDatabaseClient = cuboDatabaseClient
	}

	@Get("/get")
	CompleteInfo get() {
		return panelService.getPanelInfo()
	}

	@Get("/publisher")
	PublishSubject<Event<RealTimeRequestInfo>> getCardsPublisher() {
		return PanelPublisher.get()
	}

	@Post("/cards")
	void createCards(@Header String sessionId, @Body List<Map<String, Object>> cards) {
		panelDatabaseClient.createCards(sessionId, cards)
	}

	@Put("/cards/position")
	void updatePosition(@Header String sessionId, @Body List<Card> cards) {
		panelDatabaseClient.updateCardsPosition(sessionId, Constants.REAL_TIME_ACTION.UPDATE_CARDS_POSITION, cards)
	}

	@Put("/cards/duration")
	void updateDuration(@Header String sessionId, @Body List<Card> cards) {
		panelDatabaseClient.updateCardsDuration(sessionId, Constants.REAL_TIME_ACTION.UPDATE_CARDS_DURATION, cards)
	}

	@Put("/cards/division")
	void updateDivision(
			@Header String sessionId,
	        @QueryValue List<Integer> oldDivisionIndexes,
	        @Body List<Map<String, Object>> cards
	) {
		panelDatabaseClient.updateCardsDivision(sessionId, oldDivisionIndexes, cards)
	}

	@Put("/cards/links")
	void updateLinks(@Header String sessionId, @Body List<Card> cards) {
		panelDatabaseClient.updateCardsLinks(sessionId, Constants.REAL_TIME_ACTION.UPDATE_CARDS_LINKS, cards)
	}

	@Put("/cards/delete")
	void deleteCards(@Header String sessionId, @Body List<Map<String, Object>> cards) {
		panelDatabaseClient.deleteCards(sessionId, cards)
	}

	@Put("/mechanic/position")
	void updateMechanicsPosition(@Header String sessionId, @Body List<EmployeeSchedule> mechanics) {
		cuboDatabaseClient.updateMechanicsPosition(
				sessionId,
				Constants.REAL_TIME_ACTION.UPDATE_MECHANICS_POSITION,
				mechanics
		)
	}

	@Put("/mechanic/lines")
	void updateMechanicLines(@Header String sessionId, @Body List<EmployeeSchedule> mechanics) {
		cuboDatabaseClient.updateMechanicLines(sessionId, Constants.REAL_TIME_ACTION.UPDATE_MECHANIC_LINES, mechanics)
	}

	@Put("/mechanic/jobLineType")
	void updateMechanicJobLineType(@Header String sessionId, @Body EmployeeSchedule mechanic) {
		cuboDatabaseClient.updateMechanicJobLineType(
				sessionId,
				Constants.REAL_TIME_ACTION.UPDATE_MECHANIC_JOB_LINE_TYPE,
				mechanic
		)
	}

	@Put("/appointment/type")
	void updateAppointmentType(
			@Header String sessionId,
			@Body Map<String, Object> appointment
	) {
		cuboDatabaseClient.updateAppointmentType(sessionId, appointment)
	}

	@Delete("/appointment/type")
	void updateAppointmentType(
			@Header String sessionId,
			@QueryValue long id,
			@QueryValue long mechanicId,
			@QueryValue int index
	) {
		cuboDatabaseClient.deleteAppointment(sessionId, id, mechanicId, index)
	}

	@Post("/appointment")
	EmployeeScheduleAppointment createAppointment(
			@Header String sessionId,
			@Body MechanicAppointment mechanicAppointment
	) {
		cuboDatabaseClient.createAppointment(
				sessionId,
				Constants.REAL_TIME_ACTION.CREATE_APPOINTMENT,
				mechanicAppointment
		)
	}

	@Patch("/appointment/schedule")
	void updateAppointmentSchedule(
			@Header String sessionId,
			@Body MechanicAppointment mechanicAppointment
	) {
		cuboDatabaseClient.updateAppointmentSchedule(
				sessionId,
				Constants.REAL_TIME_ACTION.UPDATE_APPOINTMENT_SCHEDULE,
				mechanicAppointment
		)
	}

	@Put("/appointment/schedule")
	void deleteAppointmentSchedule(
			@Header String sessionId,
			@Body MechanicAppointment mechanicAppointment
	) {
		cuboDatabaseClient.deleteAppointmentSchedule(
				sessionId,
				mechanicAppointment
		)
	}

	@Put("/appointmentDay/counters")
	void updateAppointmentDays(
			@Header String sessionId,
			@Body List<Map<String, Object>> appointmentDays
	) {
		panelDatabaseClient.updateAppointmentDays(sessionId, appointmentDays)
	}

	@Put("/appointmentDay/max")
	void updateAppointmentDayMax(
			@Header String sessionId,
			@Body Map<String, Object> appointmentDay
	) {
		panelDatabaseClient.updateAppointmentDayMax(sessionId, appointmentDay)
	}

}
