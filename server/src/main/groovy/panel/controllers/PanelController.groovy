package panel.controllers

import groovy.transform.CompileStatic
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import panel.pogos.CompleteInfo
import panel.services.PanelService

@CompileStatic
@Controller("/panel")
class PanelController {

	private final PanelService panelService

	PanelController(PanelService panelService) {
		this.panelService = panelService
	}

	@Get("/get")
	CompleteInfo get() {
		CompleteInfo panelInfo = panelService.getPanelInfo()
		return panelInfo
	}

}
