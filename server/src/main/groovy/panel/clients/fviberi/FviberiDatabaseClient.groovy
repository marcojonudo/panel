package panel.clients.fviberi

import groovy.transform.CompileStatic
import io.micronaut.core.convert.format.Format
import io.micronaut.http.annotation.Get
import io.micronaut.http.annotation.Header
import io.micronaut.http.annotation.QueryValue
import io.micronaut.http.client.annotation.Client
import panel.utils.Constants

import javax.inject.Singleton

@Singleton
@CompileStatic
@Client("http://fvbm5:8082/panel")
@Header(name = "database", value = "fviberi")
interface FviberiDatabaseClient extends FviberiDatabaseApi {

	@Get("/orders")
	List<Map> getOrders(@QueryValue @Format(Constants.DATE_DB_PATTERN) Date day, @QueryValue List<String> states)

}
