package panel.clients.panel

import groovy.transform.CompileStatic
import io.micronaut.core.convert.format.Format
import io.micronaut.http.annotation.*
import io.micronaut.http.client.annotation.Client
import panel.utils.Constants
import utils.pogos.panel.AppointmentDay
import utils.pogos.panel.Card
import utils.pogos.panel.GroupUnits
import utils.pogos.panel.JobLineType
import utils.pogos.panel.Task
import utils.pogos.panel.AppointmentType

import javax.inject.Singleton

@Singleton
@CompileStatic
@Client("http://\${host.ip}:8082/panel")
@Header(name = "database", value = "panel")
interface PanelDatabaseClient extends PanelDatabaseApi {

	@Get("/tasks")
	List<Task> getTasks(@QueryValue List<Integer> articles)

	@Get("/cards")
	List<Card> getCards(@QueryValue @Format(Constants.DATE_DB_PATTERN) Date from)

	@Get("/jobLineTypes")
	List<JobLineType> getJobLineTypes()

	@Get("/appointmentTypes")
	List<AppointmentType> getAppointmentTypes()

	@Get("/appointmentDays")
	List<AppointmentDay> getAppointmentDays(@QueryValue @Format(Constants.DATE_DB_PATTERN) Date day)

	@Post("/durations")
	Map<Integer, List<GroupUnits>> getDurations(@Body Map<Integer, List<GroupUnits>> ordersGroupsUnits)

	@Post("/cards")
	List<Card> createCards(@Body List<Card> cards)

	@Put("/cards")
	List<Card> updateCards(@Body List<Card> cards)

	@Put("/cards/links")
	void updateCardsLinks(@Header String sessionId, @Body List<Map<String, Object>> cards)

	@Delete("/cards")
	List<Card> deleteCards(@Body List<Long> ids)

	@Put("/cards/position")
	List<Map> updateCardsPosition(@Header String sessionId, @Body List<Map<String, Object>> cards)

	@Put("/cards/duration")
	List<Map> updateCardDuration(@Header String sessionId, @Body List<Map<String, Object>> cards)

	@Post("/appointmentDay")
	void createAppointmentDays(@Header String sessionId, @Body List<Map<String, Object>> appointmentDays)

	@Put("/appointmentDay/counters")
	void updateAppointmentDays(@Header String sessionId, @Body List<Map<String, Object>> appointmentDays)

	@Put("/appointmentDay/max")
	void updateAppointmentDayMax(@Header String sessionId, @Body Map<String, Object> appointmentDay)

}
