package panel.controllers

import groovy.transform.CompileStatic
import io.micronaut.http.annotation.Body
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.http.annotation.Put
import panel.clients.panel.PanelDatabaseClient
import panel.clients.schedules.SchedulesDatabaseClient
import panel.pogos.CompleteInfo
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

	@Put("/cards/position")
	void updatePosition(@Body List<Map<String, Object>> cards) {
		panelDatabaseClient.updateCardsPosition(cards)
	}

	@Put("/cards/duration")
	void updateDuration(@Body List<Map<String, Object>> cards) {
		panelDatabaseClient.updateCardDuration(cards)
	}

	@Put("/cards/links")
	void updateLinks(@Body List<Map<String, Object>> cards) {
		panelDatabaseClient.updateCardsLinks(cards)
	}

	@Put("/mechanic/lines")
	void updateMechanicLines(@Body Map<String, Object> mechanic) {
		schedulesDatabaseClient.updateMechanicLines(mechanic)
	}

}
