package panel.controllers

import groovy.transform.CompileStatic
import io.micronaut.core.convert.format.Format
import io.micronaut.http.HttpResponse
import io.micronaut.http.annotation.*
import io.micronaut.http.sse.Event
import io.reactivex.subjects.PublishSubject
import panel.clients.cubo.CuboDatabaseClient
import panel.clients.panel.PanelDatabaseClient
import panel.pogos.CompleteInfo
import panel.pogos.MechanicAppointment
import panel.pogos.UpdateCards
import panel.pogos.realTime.RealTimeRequestInfo
import panel.publisher.PanelPublisher
import panel.services.PanelService
import panel.utils.Constants
import utils.pogos.panel.Card
import utils.pogos.schedules.EmployeeSchedule
import utils.pogos.schedules.EmployeeScheduleAppointment

import javax.inject.Inject
import java.time.LocalDate
import java.time.LocalTime

@CompileStatic
@Controller("/panel")
class PanelController {

	@Inject PanelService panelService
	@Inject PanelDatabaseClient panelDatabaseClient
	@Inject CuboDatabaseClient cuboDatabaseClient

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

	@Patch("/cards/vehiclePosition")
	void updateVehiclePosition(@Header String sessionId, @Body List<Card> cards) {
		panelDatabaseClient.updateVehiclePosition(sessionId, Constants.REAL_TIME_ACTION.UPDATE_VEHICLE_POSITION, cards)
	}

	@Patch("/cards/pendingMaterial")
	void updatePendingMaterial(@Header String sessionId, @Body List<Card> cards) {
		panelDatabaseClient.updatePendingMaterial(sessionId, Constants.REAL_TIME_ACTION.PENDING_MATERIAL, cards)
	}

	@Patch("/cards/pendingBudget")
	void updatePendingBudget(@Header String sessionId, @Body List<Card> cards) {
		panelDatabaseClient.updatePendingBudget(sessionId, Constants.REAL_TIME_ACTION.PENDING_BUDGET, cards)
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

	@Delete("/appointment")
	void deleteAppointmentSchedule(
		@Header String sessionId,
		@QueryValue @Format(Constants.DateFormat.yyyy_MM_dd) LocalDate day,
		@QueryValue String mechanicCode,
		@QueryValue String typeCode,
		@QueryValue String start
	) {
		cuboDatabaseClient.deleteAppointment(
			sessionId,
			Constants.REAL_TIME_ACTION.DELETE_APPOINTMENT,
			day,
			mechanicCode,
			typeCode,
			LocalTime.parse(start)
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

	@Post("/syncJpdv")
	HttpResponse<Void> syncJpdv() {
		UpdateCards updateCards = panelService.syncJpdvOrders()
		if (updateCards.updated()) {
			RealTimeRequestInfo realTimeRequestInfo = new RealTimeRequestInfo(
				Constants.REAL_TIME_ACTION.SYNC_JPDV,
				updateCards.getSyncInfo()
			)
			PanelPublisher.send("", realTimeRequestInfo)
		}
		return HttpResponse.ok()
	}

}
