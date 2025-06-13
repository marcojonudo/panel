package panel.controllers

import groovy.transform.CompileStatic
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import jakarta.inject.Inject
import panel.clients.SchedulesClient
import panel.pogos.schedules.skills.Skill

@CompileStatic
@Controller("/skills")
class SkillController {

	@Inject SchedulesClient schedulesClient

	@Get
	List<Skill> get() {
		return schedulesClient.findSkills()
	}

}
