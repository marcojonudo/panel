package panel.controllers

import groovy.transform.CompileStatic
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import panel.services.PanelService

import javax.inject.Inject

@CompileStatic
@Controller("/panel")
class PanelController {

	private final PanelService panelService

	@Inject
	PanelController(PanelService panelService) {
		this.panelService = panelService
	}

	@Get("/hello")
	String hello() {
//		Configuration configuration = configurationDataService.findByClave("planning.types")
		panelService.test()

		return null
	}

}
