//package panel.controllers
//
//import groovy.transform.CompileStatic
//import io.micronaut.http.annotation.Controller
//import jakarta.inject.Inject
//import panel.services.EcommerceService
//
//@CompileStatic
//@Controller("/eCommerce")
//class EcommerceController {
//
//	@Inject private EcommerceService ecommerceService
//
////	@Get("/schedules")
////	HttpResponse<List<List<OldEcommerceSchedule>>> getSchedules(
////		@QueryValue @Format(Constants.DateFormat.yyyy_MM_dd) LocalDate from,
////		@QueryValue @Format(Constants.DateFormat.yyyy_MM_dd) LocalDate to
////	) {
////		GetEcommerceSchedulesInfo info = ecommerceService.findSchedules(from, to)
//////		if (info.error) {
//////			return HttpResponse.status(info.error.status).body(info.schedules)
//////		}
////		return HttpResponse.ok(info.schedules)
////	}
////
////	@Post("/save")
////	EcommerceCard saveAppointment(@Body SaveEcommerceCardJson body) {
////		ecommerceService.saveCard(body.day, body.start, body.duration, body.groupCode, body.type).card
////	}
////
////	@Put("/confirm")
////	HttpResponse<ConfirmAppointmentResponse> confirmAppointment(@QueryValue String code) {
////		ConfirmAppointmentInfo info = ecommerceService.confirmAppointment(code)
////		return HttpResponse.status(info.error?.status ?: HttpStatus.OK).body(
////			new ConfirmAppointmentResponse(info.message)
////		) as HttpResponse<ConfirmAppointmentResponse>
////	}
//
//}
