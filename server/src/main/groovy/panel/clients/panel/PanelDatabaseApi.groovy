package panel.clients.panel

import groovy.transform.CompileStatic
import io.micronaut.core.convert.format.Format
import io.micronaut.http.HttpResponse
import io.micronaut.http.annotation.Body
import io.micronaut.http.annotation.Header
import io.micronaut.http.annotation.QueryValue
import panel.utils.Constants
import utils.pogos.panel.*

import javax.annotation.Nullable
import javax.inject.Singleton
import java.time.LocalDate

@Singleton
@CompileStatic
interface PanelDatabaseApi {

	List<Task> getTasks(@QueryValue List<Integer> articles)

	List<Card> getCards(
			@QueryValue @Nullable @Format(Constants.DateFormat.yyyy_MM_dd) LocalDate from,
			@QueryValue @Nullable @Format(Constants.DateFormat.yyyy_MM_dd) LocalDate to
	)

	List<JobLineType> getJobLineTypes()

	List<AppointmentType> getAppointmentTypes()

	List<AppointmentDay> getAppointmentDays(@QueryValue @Format(Constants.DateFormat.yyyy_MM_dd) LocalDate from)

	Map<Integer, List<GroupUnits>> getDurations(@Body Map<Integer, List<GroupUnits>> ordersGroupsUnits)

	List<Card> createCards(@Header String sessionId, @Body List<Map<String, Object>> cards)

	List<Card> updateCards(@Body List<Card> cards)

	void updateCardsLinks(
			@Header String sessionId,
			@Header String realTimeAction,
			@Body List<Card> cards
	)

	void deleteCards(@Header String sessionId, @Body List<Map<String, Object>> cards)

	HttpResponse<Void> updateCardsPosition(
			@Header String sessionId,
			@Header String realTimeAction,
			@Body List<Card> cards
	)

	void updateCardsDuration(
			@Header String sessionId,
			@Header String realTimeAction,
			@Body List<Card> cards
	)

	List<Map> updateCardsDivision(
			@Header String sessionId,
			@QueryValue List<Integer> oldDivisionIndexes,
			@Body List<Map<String, Object>> cards
	)

	void updateVehiclePosition(@Header String sessionId, @Header String realTimeAction, @Body List<Card> cards)

	void updatePendingCall(@Header String sessionId, @Header String realTimeAction, @Body List<Card> cards)

	void updatePendingBudget(@Header String sessionId, @Header String realTimeAction, @Body List<Card> cards)

	void createAppointmentDays(@Header String sessionId, @Body List<Map<String, Object>> appointmentDays)

	void createAppointmentDaysTotal(@Header String sessionId, @Body List<AppointmentDay> appointmentDays)

	void updateAppointmentDaysTotal(@Header String sessionId, @Body List<AppointmentDay> appointmentDays)

	void updateAppointmentDays(@Header String sessionId, @Body List<Map<String, Object>> appointmentDays)

	void updateAppointmentDayMax(@Header String sessionId, @Body Map<String, Object> appointmentDay)

}
