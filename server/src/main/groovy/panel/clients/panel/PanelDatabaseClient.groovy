package panel.clients.panel

import groovy.transform.CompileStatic
import io.micronaut.context.annotation.Requires
import io.micronaut.context.env.Environment
import io.micronaut.core.convert.format.Format
import io.micronaut.http.annotation.*
import io.micronaut.http.client.annotation.Client
import panel.utils.Constants
import utils.pogos.panel.Card
import utils.pogos.panel.GroupUnits

import javax.inject.Singleton

@Singleton
@CompileStatic
@Requires(notEnv = Environment.TEST)
@Client("http://localhost:8082/panel")
@Header(name = "database", value = "panel")
interface PanelDatabaseClient extends PanelDatabaseApi {

	@Get("/tasks")
	List<Map> getTasks(@QueryValue List<Integer> articles)

	@Get("/cards")
	List<Map> getCards(@QueryValue @Format(Constants.DATE_DB_PATTERN) Date day)

	@Post("/durations")
	Map<Integer, List<Map>> getDurations(@Body Map<Integer, List<GroupUnits>> ordersGroupsUnits)

	@Post("/cards")
	List<Map> createCards(@Body List<Card> cards)

	@Put("/cards")
	List<Map> updateCards(@Body List<Card> cards)

	@Delete("/cards")
	void deleteCards(@Body List<Long> ids)

}
