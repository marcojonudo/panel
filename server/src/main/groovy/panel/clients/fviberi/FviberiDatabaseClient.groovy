package panel.clients.fviberi

import groovy.transform.CompileStatic
import io.micronaut.core.convert.format.Format
import io.micronaut.http.annotation.Get
import io.micronaut.http.annotation.Header
import io.micronaut.http.annotation.QueryValue
import io.micronaut.http.client.annotation.Client
import panel.pogos.fviberi.Order
import panel.utils.Constants

import javax.inject.Singleton
import java.time.LocalDate

@Singleton
@CompileStatic
@Client("http://\${host.ip}:8082/panel")
@Header(name = "database", value = "fviberi")
interface FviberiDatabaseClient {

	@Get("/orders")
	List<Order> getOrders(
		@QueryValue List<String> states,
		@QueryValue @Format(Constants.DateFormat.yyyy_MM_dd) LocalDate to
	)

}
