package panel.controllers

import groovy.transform.CompileStatic
import io.micronaut.core.convert.format.Format
import io.micronaut.http.HttpResponse
import io.micronaut.http.annotation.*
import panel.pogos.eCommerce.getSchedules.DayEcommerceSchedule
import panel.pogos.eCommerce.getSchedules.GetEcommerceSchedulesInfo
import panel.services.EcommerceService
import panel.utils.Constants

import javax.inject.Inject
import java.time.LocalDate

@CompileStatic
@Controller("/eCommerce")
class EcommerceController {

	@Inject private EcommerceService ecommerceService

	@Get("/schedules")
	HttpResponse<List<DayEcommerceSchedule>> getSchedules(
			@QueryValue @Format(Constants.DateFormat.yyyy_MM_dd) LocalDate from,
			@QueryValue @Format(Constants.DateFormat.yyyy_MM_dd) LocalDate to
	) {
		GetEcommerceSchedulesInfo info = ecommerceService.findSchedules(from, to)
		if (info.error) {
			return HttpResponse.status(info.error.status).body(info.schedules)
		}
		return HttpResponse.ok(info.schedules)
	}


}
