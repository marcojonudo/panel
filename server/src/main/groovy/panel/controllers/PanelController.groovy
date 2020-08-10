package panel.controllers

import groovy.transform.CompileStatic
import io.micronaut.core.convert.format.Format
import io.micronaut.http.HttpResponse
import io.micronaut.http.annotation.*
import io.micronaut.http.sse.Event
import io.reactivex.subjects.PublishSubject
import panel.clients.CuboDatabaseClient
import panel.clients.PanelDatabaseClient
import panel.jobs.JpdvOrdersJob
import panel.pogos.appointmentDays.AppointmentDay
import panel.pogos.appointments.MechanicAppointment
import panel.pogos.cards.Card
import panel.pogos.firstLoad.CompleteInfo
import panel.pogos.realTime.RealTimeRequestInfo
import panel.pogos.schedules.EmployeeSchedule
import panel.pogos.schedules.EmployeeScheduleAppointment
import panel.publisher.PanelPublisher
import panel.services.PanelService
import panel.utils.Constants

import javax.annotation.Nullable
import javax.inject.Inject
import java.time.LocalDate
import java.time.LocalTime

@CompileStatic
@Controller("/panel")
class PanelController {

	@Inject PanelService panelService
	@Inject PanelDatabaseClient panelDatabaseClient
	@Inject CuboDatabaseClient cuboDatabaseClient
	@Inject JpdvOrdersJob jpdvOrdersJob

	@Get
	CompleteInfo get(
		@QueryValue @Format(Constants.DateFormat.yyyy_MM_dd) LocalDate from,
		@QueryValue @Format(Constants.DateFormat.yyyy_MM_dd) LocalDate to
	) {
		return panelService.getPanelInfo(from, to)
	}

	@Get("/publisher")
	PublishSubject<Event<RealTimeRequestInfo>> getCardsPublisher() {
		return PanelPublisher.get()
	}

	@Post("/cards")
	void createCards(
		@Header String sessionId, @QueryValue @Nullable Boolean updateLinks, @Body List<Map<String, Object>> cards
	) {
		panelDatabaseClient.createCards(sessionId, cards, updateLinks)
	}

	@Put("/cards/position")
	void updatePosition(@Header String sessionId, @Body List<Card> cards) {
		panelDatabaseClient.updateCardsPosition(sessionId, Constants.REAL_TIME_ACTION.UPDATE_CARDS_POSITION, cards)
	}

	@Put("/cards/duration")
	void updateDuration(@Header String sessionId, @Body List<Card> cards) {
		panelDatabaseClient.updateCardsDuration(sessionId, Constants.REAL_TIME_ACTION.UPDATE_CARDS_DURATION, cards)
	}

	@Post("/cards/division")
	void updateDivision(@Header String sessionId, @Body List<Map<String, Object>> cards) {
		panelDatabaseClient.updateCardsDivision(sessionId, Constants.REAL_TIME_ACTION.DIVIDE_CARDS, cards)
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

	@Patch("/cards/pendingCall")
	void updatePendingMaterial(@Header String sessionId, @Body List<Card> cards) {
		panelDatabaseClient.updatePendingCall(sessionId, Constants.REAL_TIME_ACTION.UPDATE_PENDING_CALL, cards)
	}

	@Patch("/cards/pendingBudget")
	void updatePendingBudget(@Header String sessionId, @Body List<Card> cards) {
		panelDatabaseClient.updatePendingBudget(sessionId, Constants.REAL_TIME_ACTION.UPDATE_PENDING_BUDGET, cards)
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
	void updateAppointmentType(@Header String sessionId, @Body Map<String, Object> appointment) {
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

	@Put("/appointmentDays")
	void updateAppointmentDays(@Header String sessionId, @Body List<AppointmentDay> appointmentDays) {
		panelDatabaseClient.updateAppointmentDays(sessionId, appointmentDays)
	}

	@Post("/syncJpdv")
	HttpResponse<Void> syncJpdv() {
		jpdvOrdersJob.execute()
		return HttpResponse.ok()
	}

}
