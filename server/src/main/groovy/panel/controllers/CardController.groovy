package panel.controllers

import groovy.transform.CompileStatic
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.http.annotation.QueryValue
import jakarta.inject.Inject
import panel.domains.schedules.JobPositionGroup
import panel.domains.skills.Skill
import panel.services.data.skills.SkillDataService

@CompileStatic
@Controller("/skills")
class CardController {

	@Inject SkillDataService skillDataService

	@Get
	List<Skill> get(@QueryValue JobPositionGroup.Code jobPositionGroupCode) {
		return skillDataService.findAll(jobPositionGroupCode)
	}

}
