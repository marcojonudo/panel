package panel.clients.panel

import groovy.transform.CompileStatic
import io.micronaut.core.convert.format.Format
import io.micronaut.http.HttpResponse
import io.micronaut.http.annotation.*
import io.micronaut.http.client.annotation.Client
import panel.utils.Constants
import utils.pogos.panel.*

import javax.annotation.Nullable
import javax.inject.Singleton
import java.time.LocalDate

@Singleton
@CompileStatic
@Client("http://\${host.ip}:8082/panel")
@Header(name = "database", value = "panel")
interface PanelDatabaseClient extends PanelDatabaseApi {

	@Get("/tasks")
	List<Task> getTasks(@QueryValue List<Integer> articles)

	@Get("/cards")
	List<Card> getCards(
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
	List<Card> createCards(@Header String sessionId, @Body List<Map<String, Object>> cards)

	@Put("/cards")
	List<Card> updateCards(@Body List<Card> cards)

	@Put("/cards/links")
	void updateCardsLinks(
			@Header @Nullable String sessionId,
			@Header @Nullable String realTimeAction,
			@Body List<Card> cards
	)

	@Post("/cards/delete")
	void deleteCards(@Header String sessionId, @Body List<Map<String, Object>> cards)

	@Put("/cards/position")
	HttpResponse<Void> updateCardsPosition(
			@Header String sessionId,
			@Header String realTimeAction,
			@Body List<Card> cards
	)

	@Put("/cards/duration")
	void updateCardsDuration(
			@Header String sessionId,
			@Header String realTimeAction,
			@Body List<Card> cards
	)

	@Put("/cards/division")
	List<Map> updateCardsDivision(
			@Header String sessionId,
			@QueryValue List<Integer> oldDivisionIndexes,
			@Body List<Map<String, Object>> cards
	)

	@Patch("/cards/vehiclePosition")
	void updateVehiclePosition(@Header String sessionId, @Header String realTimeAction, @Body List<Card> cards)

	@Patch("/cards/pendingCall")
	void updatePendingCall(@Header String sessionId, @Header String realTimeAction, @Body List<Card> cards)

	@Patch("/cards/pendingBudget")
	void updatePendingBudget(@Header String sessionId, @Header String realTimeAction, @Body List<Card> cards)

	@Post("/appointmentDay")
	void createAppointmentDays(@Header String sessionId, @Body List<Map<String, Object>> appointmentDays)

	@Post("/appointmentDay/total")
	void createAppointmentDaysTotal(@Header String sessionId, @Body List<AppointmentDay> appointmentDays)

	@Put("/appointmentDay/total")
	void updateAppointmentDaysTotal(@Header String sessionId, @Body List<AppointmentDay> appointmentDays)

	@Put("/appointmentDay/counters")
	void updateAppointmentDays(@Header String sessionId, @Body List<Map<String, Object>> appointmentDays)

	@Put("/appointmentDay/max")
	void updateAppointmentDayMax(@Header String sessionId, @Body Map<String, Object> appointmentDay)

}
