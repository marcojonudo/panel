package panel.controllers


import groovy.transform.CompileStatic
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import jakarta.inject.Inject
import panel.domains.panel.JobLineType
import panel.services.data.panel.JobLineTypeDataService

@CompileStatic
@Controller("/jobLineTypes")
class JobLineTypeController {

	@Inject JobLineTypeDataService jobLineTypeDataService

	@Get
	List<JobLineType> get() {
		return jobLineTypeDataService.findAll()
	}

}
