package panel.clients.fviberi

import groovy.transform.CompileStatic
import io.micronaut.http.annotation.Get
import io.micronaut.http.annotation.Header
import io.micronaut.http.annotation.QueryValue
import io.micronaut.http.client.annotation.Client
import utils.pogos.fviberi.Order

import javax.inject.Singleton

@Singleton
@CompileStatic
@Client("http://\${host.ip}:8082/panel")
@Header(name = "database", value = "fviberi")
interface FviberiDatabaseClient extends FviberiDatabaseApi {

	@Get("/orders")
	List<Order> getOrders(@QueryValue List<String> states)

}
