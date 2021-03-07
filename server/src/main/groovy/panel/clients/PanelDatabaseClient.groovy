package panel.clients

import groovy.transform.CompileStatic
import io.micronaut.core.convert.format.Format
import io.micronaut.http.HttpResponse
import io.micronaut.http.annotation.*
import io.micronaut.http.client.annotation.Client
import panel.pogos.appointmentDays.AppointmentDay
import panel.pogos.appointmentDays.AppointmentType
import panel.pogos.cards.CardPogo
import panel.pogos.cards.Group
import panel.pogos.cards.GroupUnits
import panel.pogos.cards.Task
import panel.pogos.schedules.JobLineType
import panel.utils.Constants

import javax.annotation.Nullable
import javax.inject.Singleton
import java.time.LocalDate

@Singleton
@CompileStatic
@Client("http://\${host.ip}:8082/panel")
@Header(name = "database", value = "panel")
interface PanelDatabaseClient {

	@Get("/tasks")
	List<Task> getTasks(@QueryValue List<Integer> articles)

	@Get("/cards")
	List<CardPogo> getCards(
		@QueryValue @Nullable @Format(Constants.DateFormat.yyyy_MM_dd) LocalDate from,
		@QueryValue @Nullable @Format(Constants.DateFormat.yyyy_MM_dd) LocalDate to
	)

	@Get("/jobLineTypes")
	List<JobLineType> getJobLineTypes()

	@Get("/appointmentTypes")
	List<AppointmentType> getAppointmentTypes()

	@Get("/appointmentDays")
	List<AppointmentDay> getAppointmentDays(@QueryValue @Format(Constants.DateFormat.yyyy_MM_dd) LocalDate from)

	@Post("/durations")
	Map<Integer, List<GroupUnits>> getDurations(@Body Map<Integer, List<GroupUnits>> ordersGroupsUnits)

	@Post("/cards")
	List<CardPogo> createCards(
		@Header String sessionId,
		@Header @Nullable String realTimeAction,
		@Body List cards,
		@QueryValue @Nullable Boolean updateLinks
	)

	@Put("/cards")
	List<CardPogo> updateCards(@Body List<CardPogo> cards)

	@Patch("/cards/links")
	void updateCardsLinks(
		@Header @Nullable String sessionId, @Header @Nullable String realTimeAction, @Body List<CardPogo> cards
	)

	@Post("/cards/delete")
	void deleteCards(@Header String sessionId, @Header String realTimeAction, @Body List<Map<String, Object>> cards)

	@Patch("/cards/position")
	HttpResponse<Void> updateCardsPosition(
		@Header String sessionId,
		@Header String realTimeAction,
		@Body List<CardPogo> cards,
		@QueryValue boolean updateLinks
	)

	@Put("/cards/duration")
	void updateCardsDuration(
		@Header String sessionId,
		@Header String realTimeAction,
		@Body List<CardPogo> cards
	)

	@Put("/cards/division")
	List<Map> updateCardsDivision(
		@Header String sessionId, @Header String realTimeAction, @Body List<Map<String, Object>> cards
	)

	@Patch("/cards/vehiclePosition")
	void updateVehiclePosition(@Header String sessionId, @Header String realTimeAction, @Body List<CardPogo> cards)

	@Patch("/cards/pendingCall")
	void updatePendingCall(@Header String sessionId, @Header String realTimeAction, @Body List<CardPogo> cards)

	@Patch("/cards/pendingBudget")
	void updatePendingBudget(@Header String sessionId, @Header String realTimeAction, @Body List<CardPogo> cards)

	@Post("/appointmentDays")
	void createAppointmentDays(@Header String sessionId, @Body List<AppointmentDay> appointmentDays)

	@Put("/appointmentDays")
	void updateAppointmentDays(@Header String sessionId, @Body List<AppointmentDay> appointmentDays)

	@Get("/lastEcommerceCode")
	String findLastEcommerceCode()

	@Get("/mechanicsCards")
	List<CardPogo> findCards(
		@QueryValue @Format(Constants.DateFormat.yyyy_MM_dd) LocalDate day,
		@QueryValue List<String> mechanicCodes
	)

	@Get("/group")
	Group findGroup(@QueryValue int code)

	@Get("/card")
	CardPogo findCard(@QueryValue String code)

	@Patch("/status")
	CardPogo updateStatus(@Body CardPogo card)

}
