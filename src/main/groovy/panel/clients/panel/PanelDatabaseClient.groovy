package panel.clients.panel

import groovy.transform.CompileStatic
import io.micronaut.context.annotation.Requires
import io.micronaut.context.env.Environment
import io.micronaut.core.convert.format.Format
import io.micronaut.http.annotation.Body
import io.micronaut.http.annotation.Delete
import io.micronaut.http.annotation.Get
import io.micronaut.http.annotation.Header
import io.micronaut.http.annotation.Post
import io.micronaut.http.annotation.Put
import io.micronaut.http.annotation.QueryValue
import io.micronaut.http.client.annotation.Client
import utils.pogos.panel.Card
import utils.pogos.panel.GroupUnits

import javax.inject.Singleton

@Singleton
@CompileStatic
@Requires(notEnv = Environment.TEST)
@Client("http://localhost:8084/panel")
@Header(name = "database", value = "cubo2")
interface PanelDatabaseClient extends PanelDatabaseApi {

	@Get("/tasks")
	List<Map> getTasks(@QueryValue List<Integer> articles)

	@Get("/cards")
	List<Map> getCards(@QueryValue @Format("yyyy-mm-dd") Date day)

	@Post("/durations")
	List<Integer> getDurations(@Body List<GroupUnits> groupUnits)

	@Put("/cards")
	List<Map> updateCards(@Body List<Card> cards)

	@Post("/cards")
	List<Map> createCards(@Body List<Card> cards)

	@Delete("/cards")
	List<Map> deleteCards(@Body List<Long> ids)

}
