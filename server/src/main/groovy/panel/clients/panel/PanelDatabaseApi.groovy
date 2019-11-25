package panel.clients.panel

import groovy.transform.CompileStatic
import io.micronaut.core.convert.format.Format
import io.micronaut.http.annotation.Body
import io.micronaut.http.annotation.Header
import io.micronaut.http.annotation.QueryValue
import panel.utils.Constants
import utils.pogos.panel.*

import javax.inject.Singleton

@Singleton
@CompileStatic
interface PanelDatabaseApi {

	List<Task> getTasks(@QueryValue List<Integer> articles)
	List<Card> getCards(@QueryValue @Format(Constants.DATE_DB_PATTERN) Date from)
	List<JobLineType> getJobLineTypes()
	List<AppointmentType> getAppointmentTypes()
	Map<Integer, List<GroupUnits>> getDurations(@Body Map<Integer, List<GroupUnits>> ordersGroupsUnits)
	List<Card> createCards(@Body List<Card> cards)
	List<Card> updateCards(@Body List<Card> cards)
	void updateCardsLinks(@Header String sessionId, @Body List<Map<String, Object>> cards)
	List<Card> deleteCards(@Body List<Long> ids)
	List<Map> updateCardsPosition(@Header String sessionId, @Body List<Map<String, Object>> cards)
	Map updateCardDuration(@Header String sessionId, @Body Map<String, Object> card)

}
