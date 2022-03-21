package panel.controllers

import groovy.transform.CompileStatic
import io.micronaut.core.convert.format.Format
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.http.annotation.QueryValue
import jakarta.inject.Inject
import panel.domains.panel.AppointmentDay
import panel.services.data.panel.AppointmentDayDataService
import panel.utils.Constants

import java.time.LocalDate

@CompileStatic
@Controller("/appointmentDays")
class AppointmentDayController {

	@Inject AppointmentDayDataService appointmentDayDataService

	@Get
	List<AppointmentDay> get(@QueryValue @Format(Constants.DateFormat.yyyy_MM_dd) LocalDate from) {
		return appointmentDayDataService.findAll(from)
	}

}
