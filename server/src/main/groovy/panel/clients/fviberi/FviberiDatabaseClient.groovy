package panel.clients.fviberi

import groovy.transform.CompileStatic
import io.micronaut.context.annotation.Requires
import io.micronaut.context.env.Environment
import io.micronaut.core.convert.format.Format
import io.micronaut.http.annotation.Get
import io.micronaut.http.annotation.Header
import io.micronaut.http.annotation.QueryValue
import io.micronaut.http.client.annotation.Client

import javax.inject.Singleton

@Singleton
@CompileStatic
@Requires(notEnv = Environment.TEST)
@Client("http://localhost:8084/panel")
@Header(name = "database", value = "fviberi")
interface FviberiDatabaseClient extends FviberiDatabaseApi {

	@Get("/orders")
	List<Map> getOrders(@QueryValue @Format("yyyy-mm-dd") Date day, @QueryValue List<String> states)

}
