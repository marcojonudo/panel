package panel.controllers

import grails.gorm.transactions.Transactional
import groovy.transform.CompileStatic
import io.micronaut.core.convert.format.Format
import io.micronaut.http.HttpResponse
import io.micronaut.http.annotation.*
import io.micronaut.http.sse.Event
import io.reactivex.subjects.PublishSubject
import panel.domains.panel.AppointmentDay
import panel.domains.panel.Card
import panel.domains.panel.MechanicAppointment
import panel.domains.schedules.EmployeeSchedule
import panel.jobs.JpdvOrdersJob
import panel.pogos.firstLoad.CompleteInfo
import panel.pogos.realTime.RealTimeRequestInfo
import panel.publisher.PanelPublisher
import panel.services.PanelService
import panel.services.data.panel.AppointmentDayDataService
import panel.services.data.panel.CardDataService
import panel.services.data.panel.MechanicAppointmentDataService
import panel.services.data.panel.MechanicPanelInfoDataService
import panel.utils.Constants

import javax.annotation.Nullable
import javax.inject.Inject
import java.time.LocalDate
import java.time.LocalTime

@CompileStatic
@Controller("/panel")
class PanelController {

	@Inject PanelService panelService
	@Inject CardDataService cardDataService
	@Inject JpdvOrdersJob jpdvOrdersJob
	@Inject AppointmentDayDataService appointmentDayDataService
	@Inject MechanicPanelInfoDataService mechanicPanelInfoDataService
	@Inject MechanicAppointmentDataService mechanicAppointmentDataService

	@Get
	CompleteInfo get(
		@QueryValue @Format(Constants.DateFormat.yyyy_MM_dd) LocalDate from,
		@QueryValue @Format(Constants.DateFormat.yyyy_MM_dd) LocalDate to
	) {
		return panelService.getPanelInfo(from, to)
	}

	@Get("/publisher")
	PublishSubject<Event<RealTimeRequestInfo>> getCardsPublisher() {
		return PanelPublisher.get()
	}

	@Post("/cards")
	void createCards(
		@Header String sessionId, @QueryValue @Nullable Boolean updateLinks, @Body List<Card> cards
	) {
		cards.each { cardDataService.saveCard(it) }
		if (updateLinks) {
			cardDataService.initLinkedCards(cards)
		}
	}

	@Patch("/cards/position")
	void updatePosition(@Header String sessionId, @Body List<Card> cards) {
		//TODO Revisar el uso de updateLinks, que posiblemente se pueda quitar
		cardDataService.updatePosition(cards)
	}

	@Put("/cards/duration")
	void updateDuration(@Header String sessionId, @Body List<Card> cards) {
		cardDataService.updateDuration(cards)
	}

	@Post("/cards/division")
	void updateDivision(@Header String sessionId, @Body List<Card> cards) {
		cardDataService.updateDivision(cards)
	}

	@Patch("/cards/links")
	void updateLinks(@Header String sessionId, @Body List<Card> cards) {
		cardDataService.updateLinks(cards)
	}

	@Patch("/cards/resetLinks")
	void updateAllLinks(@Header String sessionId, @Body List<Card> cards) {
		// TODO La única diferencia era el valor del realTimeAction
		cardDataService.updateLinks(cards)
	}

	@Put("/cards/delete")
	void deleteCards(@Header String sessionId, @Body List<Card> cards) {
		cardDataService.updateDeleted(cards)
	}

	@Patch("/cards/vehiclePosition")
	void updateVehiclePosition(@Header String sessionId, @Body Card card) {
		cardDataService.updateVehiclePosition(card, card.vehiclePosition)
	}

	@Patch("/cards/pendingCall")
	void updatePendingMaterial(@Header String sessionId, @Body Card card) {
		cardDataService.updatePendingCall(card, card.pending.call)
	}

	@Patch("/cards/pendingBudget")
	void updatePendingBudget(@Header String sessionId, @Body Card card) {
		cardDataService.updatePendingBudget(card, card.pending.budget)
	}

	@Put("/mechanic/position")
	void updateMechanicsPosition(@Header String sessionId, @Body List<EmployeeSchedule> mechanics) {
		mechanics.each {
			mechanicPanelInfoDataService.update(
				it.mechanicPanelInfo.id, it.mechanicPanelInfo.show, it.mechanicPanelInfo.position
			)
		}
	}

	@Put("/mechanic/lines")
	void updateMechanicLines(@Header String sessionId, @Body List<EmployeeSchedule> mechanics) {
		mechanics.each { mechanicPanelInfoDataService.update(it.mechanicPanelInfo.id, it.mechanicPanelInfo.lines) }
	}

	@Put("/mechanic/jobLineType")
	void updateMechanicJobLineType(@Header String sessionId, @Body EmployeeSchedule mechanic) {
		mechanicPanelInfoDataService.update(mechanic.mechanicPanelInfo.id, mechanic.mechanicPanelInfo.jobLineType)
	}

//	@Put("/appointment/type")
//	void updateAppointmentType(@Header String sessionId, @Body Map<String, Object> appointment) {
//		cuboDatabaseClient.updateAppointmentType(sessionId, appointment)
//	}

	@Post("/appointment")
	@Transactional(value = Constants.DataSource.SCHEDULES)
	void createAppointment(
		@Header String sessionId,
		@QueryValue @Format(Constants.DateFormat.yyyy_MM_dd) LocalDate day,
		@QueryValue String mechanicCode,
		@Body MechanicAppointment mechanicAppointment
	) {
		mechanicAppointmentDataService.save(day, mechanicCode, mechanicAppointment)
	}

	@Patch("/appointment")
	@Transactional(value = Constants.DataSource.SCHEDULES)
	void updateAppointmentSchedule(
		@Header String sessionId,
		@QueryValue @Format(Constants.DateFormat.yyyy_MM_dd) LocalDate day,
		@QueryValue String mechanicCode,
		@QueryValue String appointmentTypeCode,
		@QueryValue String lastStart,
		@QueryValue String lastEnd,
		@Body MechanicAppointment mechanicAppointment
	) {
		mechanicAppointmentDataService.update(
			day,
			mechanicCode,
			appointmentTypeCode,
			LocalTime.parse(lastStart),
			LocalTime.parse(lastEnd),
			mechanicAppointment.interval
		)
	}

	@Delete("/appointment")
	@Transactional(value = Constants.DataSource.SCHEDULES)
	void deleteAppointmentSchedule(
		@Header String sessionId,
		@QueryValue @Format(Constants.DateFormat.yyyy_MM_dd) LocalDate day,
		@QueryValue String mechanicCode,
		@QueryValue String appointmentTypeCode,
		@QueryValue String lastStart,
		@QueryValue String lastEnd
	) {
		mechanicAppointmentDataService.delete(
			day, mechanicCode, appointmentTypeCode, LocalTime.parse(lastStart), LocalTime.parse(lastEnd)
		)
	}

	@Put("/appointmentDays")
	void updateAppointmentDays(@Header String sessionId, @Body List<AppointmentDay> appointmentDays) {
		appointmentDayDataService.update(appointmentDays)
	}

	@Post("/syncJpdv")
	HttpResponse<Void> syncJpdv() {
		jpdvOrdersJob.execute()
		return HttpResponse.ok()
	}

}
