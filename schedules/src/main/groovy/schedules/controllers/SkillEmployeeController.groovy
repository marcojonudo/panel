package schedules.controllers

import groovy.transform.CompileStatic
import io.micronaut.http.annotation.Controller
import jakarta.inject.Inject
import schedules.domains.skills.SkillEmployee
import schedules.services.data.skills.SkillEmployeeDataService

@CompileStatic
@Controller("/skillEmployees")
class SkillEmployeeController {

	@Inject SkillEmployeeDataService skillEmployeeDataService

	
	List<SkillEmployee> get(List<String> mechanicCodes) {
		return skillEmployeeDataService.findAll(mechanicCodes)
	}

}
