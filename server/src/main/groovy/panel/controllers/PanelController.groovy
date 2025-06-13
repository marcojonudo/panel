//package panel.controllers
//
//import grails.gorm.transactions.Transactional
//import groovy.transform.CompileStatic
//import io.micronaut.core.annotation.Nullable
//import io.micronaut.core.convert.format.Format
//import io.micronaut.http.HttpResponse
//import io.micronaut.http.annotation.*
//import jakarta.inject.Inject
//import panel.domains.AppointmentDay
//import panel.domains.Card
//import panel.domains.MechanicAppointment
//import panel.pogos.firstLoad.CompleteInfo
//import panel.pogos.realTime.objects.RealTimeMechanicAppointment
//import panel.services.PanelService
//import panel.services.data.AppointmentDayDataService
//import panel.services.data.CardDataService
//import panel.services.data.MechanicAppointmentDataService
//import panel.services.data.MechanicPanelInfoDataService
//import panel.utils.Constants
//
//import java.time.LocalDate
//import java.time.LocalTime
//
//@CompileStatic
//@Controller("/panel")
//class PanelController {
//
//	@Inject PanelService panelService
//	@Inject CardDataService cardDataService
////	@Inject JpdvOrdersJob jpdvOrdersJob
//	@Inject AppointmentDayDataService appointmentDayDataService
//	@Inject MechanicPanelInfoDataService mechanicPanelInfoDataService
//	@Inject MechanicAppointmentDataService mechanicAppointmentDataService
//
//	@Get
//	CompleteInfo get(
//		@QueryValue @Format(Constants.DateFormat.yyyy_MM_dd) LocalDate from,
//		@QueryValue @Format(Constants.DateFormat.yyyy_MM_dd) LocalDate to
//	) {
//		return panelService.getPanelInfo(from, to)
//	}
//
////	@Get("/publisher")
////	PublishSubject<Event<RealTimeInfo>> getCardsPublisher() {
////		return PanelPublisher.get()
////	}
//
//	@Post("/cards")
//	void createCards(
//		@Header String sessionId, @QueryValue @Nullable Boolean updateLinks, @Body List<Card> cards
//	) {
//		cards.each { cardDataService.saveCard(it) }
//		if (updateLinks) {
//			cardDataService.initLinkedCards(cards)
//		}
//	}
//
//	@Patch("/cards/position")
//	void updatePosition(@Header String sessionId, @Body List<Card> cards) {
//		cardDataService.updatePosition(cards)
////		PanelPublisher.send(sessionId, new RealTimeInfo(RealTimeAction.UPDATE_CARDS_POSITION, new RealTimeCards(cards)))
//	}
//
//	@Put("/cards/duration")
//	void updateDuration(@Header String sessionId, @Body List<Card> cards) {
//		cardDataService.updateDuration(cards)
////		PanelPublisher.send(sessionId, new RealTimeInfo(RealTimeAction.UPDATE_CARDS_DURATION, new RealTimeCards(cards)))
//	}
//
//	@Post("/cards/division")
//	void updateDivision(@Header String sessionId, @Body List<Card> cards) {
//		cardDataService.updateDivision(cards)
////		PanelPublisher.send(sessionId, new RealTimeInfo(RealTimeAction.DIVIDE_CARDS, new RealTimeCards(cards)))
//	}
//
//	@Patch("/cards/links")
//	void updateLinks(@Header String sessionId, @Body List<Card> cards) {
//		cardDataService.updateLinks(cards)
////		PanelPublisher.send(sessionId, new RealTimeInfo(RealTimeAction.UPDATE_CARDS_LINKS, new RealTimeCards(cards)))
//	}
//
//	@Patch("/cards/resetLinks")
//	void updateAllLinks(@Header String sessionId, @Body List<Card> cards) {
//		cardDataService.updateLinks(cards)
////		PanelPublisher.send(sessionId, new RealTimeInfo(RealTimeAction.RESET_CARDS_LINKS, new RealTimeCards(cards)))
//	}
//
//	@Put("/cards/delete")
//	void deleteCards(@Header String sessionId, @Body List<Card> cards) {
//		cardDataService.updateDeleted(cards)
////		PanelPublisher.send(sessionId, new RealTimeInfo(RealTimeAction.DELETE_CARDS, new RealTimeCards(cards)))
//	}
//
//	@Patch("/cards/vehiclePosition")
//	void updateVehiclePosition(@Header String sessionId, @Body Card card) {
//		cardDataService.updateVehiclePosition(card, card.vehiclePosition)
////		PanelPublisher.send(
////			sessionId, new RealTimeInfo(RealTimeAction.UPDATE_CARD_VEHICLE_POSITION, new RealTimeCard(card))
////		)
//	}
//
//	@Patch("/cards/pendingCall")
//	void updatePendingMaterial(@Header String sessionId, @Body Card card) {
//		cardDataService.updatePendingCall(card, card.pending.call)
////		PanelPublisher.send(
////			sessionId, new RealTimeInfo(RealTimeAction.UPDATE_CARD_PENDING_CALL, new RealTimeCard(card))
////		)
//	}
//
//	@Patch("/cards/pendingBudget")
//	void updatePendingBudget(@Header String sessionId, @Body Card card) {
//		cardDataService.updatePendingBudget(card, card.pending.budget)
////		PanelPublisher.send(
////			sessionId, new RealTimeInfo(RealTimeAction.UPDATE_CARD_PENDING_BUDGET, new RealTimeCard(card))
////		)
//	}
//
////	@Put("/mechanic/position")
////	void updateMechanicsPosition(@Header String sessionId, @Body List<EmployeeSchedule> mechanics) {
////		mechanics.each {
////			mechanicPanelInfoDataService.update(
////				it.panelInfo.id, it.panelInfo.show, it.panelInfo.position
////			)
////		}
//////		PanelPublisher.send(
//////			sessionId, new RealTimeInfo(RealTimeAction.UPDATE_MECHANICS_POSITION, new RealTimeMechanics(mechanics))
//////		)
////	}
////
////	@Put("/mechanic/lines")
////	void updateMechanicLines(@Header String sessionId, @Body EmployeeSchedule mechanic) {
////		mechanicPanelInfoDataService.update(mechanic.panelInfo.id, mechanic.panelInfo.lines)
//////		PanelPublisher.send(
//////			sessionId, new RealTimeInfo(RealTimeAction.UPDATE_MECHANIC_LINES, new RealTimeMechanic(mechanic))
//////		)
////	}
////
////	@Put("/mechanic/jobLineType")
////	void updateMechanicJobLineType(@Header String sessionId, @Body EmployeeSchedule mechanic) {
////		mechanicPanelInfoDataService.update(mechanic.panelInfo.id, mechanic.panelInfo.jobLineType)
//////		PanelPublisher.send(
//////			sessionId, new RealTimeInfo(RealTimeAction.UPDATE_MECHANIC_JOB_LINE_TYPE, new RealTimeMechanic(mechanic))
//////		)
////	}
//
//	@Post("/appointment")
//	@Transactional(value = Constants.DataSource.SCHEDULES)
//	void createAppointment(
//		@Header String sessionId,
//		@QueryValue @Format(Constants.DateFormat.yyyy_MM_dd) LocalDate day,
//		@QueryValue String mechanicCode,
//		@Body MechanicAppointment mechanicAppointment
//	) {
//		mechanicAppointmentDataService.save(day, mechanicCode, mechanicAppointment)
//		RealTimeMechanicAppointment realTimeMechanicAppointment = new RealTimeMechanicAppointment(
//			day, mechanicCode, mechanicAppointment, mechanicAppointment.appointmentTypeCode
//		)
////		PanelPublisher.send(
////			sessionId, new RealTimeInfo(RealTimeAction.CREATE_MECHANIC_APPOINTMENT, realTimeMechanicAppointment)
////		)
//	}
//
//	@Patch("/appointment")
//	@Transactional(value = Constants.DataSource.SCHEDULES)
//	void updateAppointmentSchedule(
//		@Header String sessionId,
//		@QueryValue @Format(Constants.DateFormat.yyyy_MM_dd) LocalDate day,
//		@QueryValue String mechanicCode,
//		@QueryValue String lastStart,
//		@QueryValue String lastEnd,
//		@Body MechanicAppointment mechanicAppointment
//	) {
//		LocalTime start = LocalTime.parse(lastStart)
//		LocalTime end = LocalTime.parse(lastEnd)
//		mechanicAppointmentDataService.update(
//			day, mechanicCode, mechanicAppointment.appointmentTypeCode, start, end, mechanicAppointment.interval
//		)
//		RealTimeMechanicAppointment realTimeMechanicAppointment = new RealTimeMechanicAppointment(
//			day, mechanicCode, mechanicAppointment, mechanicAppointment.appointmentTypeCode, start, end
//		)
////		PanelPublisher.send(
////			sessionId, new RealTimeInfo(RealTimeAction.UPDATE_MECHANIC_APPOINTMENT, realTimeMechanicAppointment)
////		)
//	}
//
//	@Delete("/appointment")
//	@Transactional(value = Constants.DataSource.SCHEDULES)
//	void deleteAppointmentSchedule(
//		@Header String sessionId,
//		@QueryValue @Format(Constants.DateFormat.yyyy_MM_dd) LocalDate day,
//		@QueryValue String mechanicCode,
//		@QueryValue String appointmentTypeCode,
//		@QueryValue String lastStart,
//		@QueryValue String lastEnd
//	) {
//		LocalTime start = LocalTime.parse(lastStart)
//		LocalTime end = LocalTime.parse(lastEnd)
//		mechanicAppointmentDataService.delete(day, mechanicCode, appointmentTypeCode, start, end)
//		RealTimeMechanicAppointment realTimeMechanicAppointment = new RealTimeMechanicAppointment(
//			day, mechanicCode, null, appointmentTypeCode, start, end
//		)
////		PanelPublisher.send(
////			sessionId, new RealTimeInfo(RealTimeAction.DELETE_MECHANIC_APPOINTMENT, realTimeMechanicAppointment)
////		)
//	}
//
//	@Put("/appointmentDays")
//	void updateAppointmentDays(@Header String sessionId, @Body List<AppointmentDay> appointmentDays) {
//		appointmentDayDataService.update(appointmentDays)
//	}
//
//	@Post("/syncJpdv")
//	HttpResponse<Void> syncJpdv() {
////		jpdvOrdersJob.execute()
//		return HttpResponse.ok()
//	}
//
//}
