package panel.controllers

import groovy.transform.CompileStatic
import io.micronaut.core.convert.format.Format
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.http.annotation.QueryValue
import jakarta.inject.Inject
import panel.pogos.schedules.EmployeeSchedule
import panel.services.MechanicService
import panel.utils.Constants

import java.time.LocalDate

@CompileStatic
@Controller("/mechanics")
class MechanicController {

	@Inject MechanicService mechanicService

	@Get
	List<EmployeeSchedule> get(
		@QueryValue @Format(Constants.DateFormat.yyyy_MM_dd) LocalDate from,
		@QueryValue @Format(Constants.DateFormat.yyyy_MM_dd) LocalDate to
	) {
		return mechanicService.findMechanics(from, to)
	}

}
