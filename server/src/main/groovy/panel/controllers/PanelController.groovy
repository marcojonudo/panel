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

	@Put("/mechanic/lines")
	void updateMechanicLines(@Header String sessionId, @Body Map<String, Object> mechanic) {
		schedulesDatabaseClient.updateMechanicLines(sessionId, mechanic)
	}

}
