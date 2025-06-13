package schedules.controllers

import groovy.transform.CompileStatic
import io.micronaut.core.convert.format.Format
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.http.annotation.QueryValue
import jakarta.inject.Inject
import schedules.domains.EmployeeSchedule
import schedules.services.MechanicsService
import schedules.utils.Constants

import java.time.LocalDate

@CompileStatic
@Controller("/mechanics")
class MechanicController {

	@Inject MechanicsService mechanicsService

	@Get
	List<EmployeeSchedule> get(
        @QueryValue @Format(Constants.DateFormat.yyyy_MM_dd) LocalDate from,
        @QueryValue @Format(Constants.DateFormat.yyyy_MM_dd) LocalDate to
	) {
		return mechanicsService.findMechanics(from, to)
	}

}
