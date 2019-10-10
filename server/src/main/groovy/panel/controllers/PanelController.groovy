package panel.controllers

import groovy.transform.CompileStatic
import io.micronaut.http.annotation.Body
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.http.annotation.Put
import panel.clients.panel.PanelDatabaseClient
import panel.pogos.CompleteInfo
import panel.services.PanelService

@CompileStatic
@Controller("/panel")
class PanelController {

	private final PanelService panelService
	private final PanelDatabaseClient panelDatabaseClient

	PanelController(PanelService panelService, PanelDatabaseClient panelDatabaseClient) {
		this.panelService = panelService
		this.panelDatabaseClient = panelDatabaseClient
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
	void updatePosition(@Body Map<String, Object> card) {
		panelDatabaseClient.updateCardDuration(card)
	}

}
