package schedules.controllers

import groovy.transform.CompileStatic
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import jakarta.inject.Inject
import schedules.domains.skills.Skill
import schedules.pogos.JobPositionGroupCode
import schedules.services.data.skills.SkillDataService

@CompileStatic
@Controller("/skills")
class SkillController {

	@Inject SkillDataService skillDataService

	@Get
	List<Skill> get() {
		return skillDataService.findAll(JobPositionGroupCode.GARAGE)
	}

}
