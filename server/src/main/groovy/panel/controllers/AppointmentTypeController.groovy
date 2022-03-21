package panel.controllers

import groovy.transform.CompileStatic
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import jakarta.inject.Inject
import panel.domains.panel.AppointmentType
import panel.services.data.panel.AppointmentTypeDataService

@CompileStatic
@Controller("/appointmentTypes")
class AppointmentTypeController {

	@Inject AppointmentTypeDataService appointmentTypeDataService

	@Get
	List<AppointmentType> get() {
		return appointmentTypeDataService.findAll()
	}

}
