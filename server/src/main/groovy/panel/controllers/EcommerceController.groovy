package panel.controllers

import groovy.transform.CompileStatic
import io.micronaut.core.convert.format.Format
import io.micronaut.http.HttpResponse
import io.micronaut.http.HttpStatus
import io.micronaut.http.annotation.*
import panel.pogos.eCommerce.confirm.ConfirmAppointmentInfo
import panel.pogos.eCommerce.confirm.ConfirmAppointmentResponse
import panel.pogos.eCommerce.getSchedules.GetEcommerceSchedulesInfo
import panel.pogos.eCommerce.getSchedules.OldEcommerceSchedule
import panel.pogos.eCommerce.save.EcommerceCard
import panel.pogos.eCommerce.save.SaveEcommerceCardJson
import panel.services.EcommerceService
import panel.utils.Constants

import javax.inject.Inject
import java.time.LocalDate

@CompileStatic
@Controller("/eCommerce")
class EcommerceController {

	@Inject private EcommerceService ecommerceService

	@Get("/schedules")
	HttpResponse<List<List<OldEcommerceSchedule>>> getSchedules(
		@QueryValue @Format(Constants.DateFormat.yyyy_MM_dd) LocalDate from,
		@QueryValue @Format(Constants.DateFormat.yyyy_MM_dd) LocalDate to
	) {
		GetEcommerceSchedulesInfo info = ecommerceService.findSchedules(from, to)
//		if (info.error) {
//			return HttpResponse.status(info.error.status).body(info.schedules)
//		}
		return HttpResponse.ok(info.schedules)
	}

	@Post("/save")
	EcommerceCard saveAppointment(@Body SaveEcommerceCardJson body) {
		ecommerceService.saveCard(body.day, body.start, body.duration, body.groupCode, body.type).card
	}

	@Put("/confirm")
	HttpResponse<ConfirmAppointmentResponse> confirmAppointment(@QueryValue String code) {
		ConfirmAppointmentInfo info = ecommerceService.confirmAppointment(code)
		return HttpResponse.status(info.error?.status ?: HttpStatus.OK).body(
			new ConfirmAppointmentResponse(info.message)
		) as HttpResponse<ConfirmAppointmentResponse>
	}

}
