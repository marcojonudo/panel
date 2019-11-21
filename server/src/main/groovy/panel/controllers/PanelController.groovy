package panel.controllers

import groovy.transform.CompileStatic
import io.micronaut.http.annotation.*
import io.micronaut.http.sse.Event
import io.reactivex.subjects.PublishSubject
import panel.clients.panel.PanelDatabaseClient
import panel.clients.schedules.SchedulesDatabaseClient
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
	private final SchedulesDatabaseClient schedulesDatabaseClient

	PanelController(
			PanelService panelService,
			PanelDatabaseClient panelDatabaseClient,
			SchedulesDatabaseClient schedulesDatabaseClient
	) {
		this.panelService = panelService
		this.panelDatabaseClient = panelDatabaseClient
		this.schedulesDatabaseClient = schedulesDatabaseClient
	}

	@Get("/get")
	CompleteInfo get() {
		CompleteInfo panelInfo = panelService.getPanelInfo()
		return panelInfo
	}

	@Get("/publisher")
	PublishSubject<Event<PublisherInfo>> getCardsPublisher() {
		return PanelPublisher.get()
	}

	@Put("/cards/position")
	void updatePosition(@Header String sessionId, @Body List<Map<String, Object>> cards) {
		panelDatabaseClient.updateCardsPosition(sessionId, cards)
	}

	@Put("/cards/duration")
	void updateDuration(@Header String sessionId, @Body List<Map<String, Object>> cards) {
		panelDatabaseClient.updateCardDuration(sessionId, cards)
	}

	@Put("/cards/links")
	void updateLinks(@Header String sessionId, @Body List<Map<String, Object>> cards) {
		panelDatabaseClient.updateCardsLinks(sessionId, cards)
	}

	@Put("/mechanic/position")
	void updateMechanicsPosition(@Header String sessionId, @Body List<Map<String, Object>> mechanics) {
		schedulesDatabaseClient.updateMechanicsPosition(sessionId, mechanics)
	}

	@Put("/mechanic/lines")
	void updateMechanicLines(@Header String sessionId, @Body List<Map<String, Object>> mechanics) {
		schedulesDatabaseClient.updateMechanicLines(sessionId, mechanics)
	}

	@Put("/mechanic/appointments")
	void updateAppointmentsSchedules(
			@Header String sessionId,
			@Body List<Map<String, Object>> mechanics,
			@QueryValue boolean morning
	) {
		Map<String, Object> appointment = ((List<Map<String, Object>>) mechanics[0].appointments).find {
			!it.schedule ||
					(morning ? ((Map<String, Object>) it.schedule).morningStart : ((Map<String, Object>) it.schedule).afternoonStart)
		}
		if (appointment.appointmentType) {
			schedulesDatabaseClient.updateMechanicAppointmentsSchedules(sessionId, mechanics, morning)
		} else {
			schedulesDatabaseClient.deleteMechanicAppointmentSchedule(sessionId, mechanics)
 		}
	}

	@Post("/mechanic/appointments")
	EmployeeScheduleAppointment createAppointmentSchedule(
			@Header String sessionId,
			@Body List<Map<String, Object>> mechanics,
			@QueryValue boolean morning
	) {
		return schedulesDatabaseClient.createMechanicAppointmentsSchedules(sessionId, mechanics, morning)
	}

}
