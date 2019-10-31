package panel.clients.panel

import groovy.transform.CompileStatic
import io.micronaut.core.convert.format.Format
import io.micronaut.http.annotation.*
import io.micronaut.http.client.annotation.Client
import panel.utils.Constants
import utils.pogos.panel.Card
import utils.pogos.panel.GroupUnits
import utils.pogos.panel.JobLineType
import utils.pogos.panel.Task

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

	@Post("/durations")
	Map<Integer, List<GroupUnits>> getDurations(@Body Map<Integer, List<GroupUnits>> ordersGroupsUnits)

	@Post("/cards")
	List<Card> createCards(@Body List<Card> cards)

	@Put("/cards")
	List<Card> updateCards(@Body List<Card> cards)

	@Put("/cardsLinks")
	void updateCardsLinks(@Body List<Map<String, Object>> cards)

	@Delete("/cards")
	List<Card> deleteCards(@Body List<Long> ids)

	@Put("/cards/position")
	List<Map> updateCardsPosition(@Body List<Map<String, Object>> cards)

	@Put("/cards/duration")
	List<Map> updateCardDuration(@Body List<Map<String, Object>> cards)

}
