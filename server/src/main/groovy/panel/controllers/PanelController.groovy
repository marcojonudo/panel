package panel.controllers

import groovy.transform.CompileStatic
import io.micronaut.http.annotation.*
import io.micronaut.http.sse.Event
import io.reactivex.subjects.PublishSubject
import panel.clients.cubo.CuboDatabaseClient
import panel.clients.panel.PanelDatabaseClient
import panel.pogos.CompleteInfo
import panel.pogos.PublisherInfo
import panel.publisher.PanelPublisher
import panel.services.PanelService
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
	PublishSubject<Event<PublisherInfo>> getCardsPublisher() {
		return PanelPublisher.get()
	}

	@Post("/cards")
	void createCards(@Header String sessionId, @Body List<Map<String, Object>> cards) {
		panelDatabaseClient.createCards(sessionId, cards)
	}

	@Put("/cards/position")
	void updatePosition(@Header String sessionId, @Body List<Map<String, Object>> cards) {
		panelDatabaseClient.updateCardsPosition(sessionId, cards)
	}

	@Put("/cards/duration")
	void updateDuration(@Header String sessionId, @Body List<Map<String, Object>> cards) {
		panelDatabaseClient.updateCardsDuration(sessionId, cards)
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
	void updateLinks(@Header String sessionId, @Body List<Map<String, Object>> cards) {
		panelDatabaseClient.updateCardsLinks(sessionId, cards)
	}

	@Put("/cards/delete")
	void deleteCards(@Header String sessionId, @Body List<Map<String, Object>> cards) {
		panelDatabaseClient.deleteCards(sessionId, cards)
	}

	@Put("/mechanic/position")
	void updateMechanicsPosition(@Header String sessionId, @Body List<Map<String, Object>> mechanics) {
		cuboDatabaseClient.updateMechanicsPosition(sessionId, mechanics)
	}

	@Put("/mechanic/lines")
	void updateMechanicLines(@Header String sessionId, @Body List<Map<String, Object>> mechanics) {
		cuboDatabaseClient.updateMechanicLines(sessionId, mechanics)
	}

	@Put("/mechanic/jobLineType")
	void updateMechanicJobLineType(@Header String sessionId, @Body List<Map<String, Object>> mechanics) {
		cuboDatabaseClient.updateMechanicJobLineType(sessionId, mechanics)
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

	@Post("/appointment/schedule")
	EmployeeScheduleAppointment createAppointment(
			@Header String sessionId,
			@Body Map<String, Object> appointment,
			@QueryValue long mechanicId
	) {
		return cuboDatabaseClient.createAppointment(sessionId, appointment, mechanicId)
	}

	@Put("/appointment/schedule")
	void updateAppointmentSchedule(
			@Header String sessionId,
			@Body Map<String, Object> appointment
	) {
		cuboDatabaseClient.updateAppointmentSchedule(sessionId, appointment)
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
