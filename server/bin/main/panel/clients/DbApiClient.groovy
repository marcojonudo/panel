package panel.clients

import groovy.transform.CompileStatic
import io.micronaut.core.convert.format.Format
import io.micronaut.http.annotation.Get
import io.micronaut.http.annotation.QueryValue
import io.micronaut.http.client.annotation.Client
import jakarta.inject.Singleton
import panel.pogos.fviberi.Order
import panel.utils.Constants

import java.time.LocalDate

@Singleton
@CompileStatic
@Client("\${services.db-api.url}")
interface DbApiClient {

	@Get("/fviberi/orders")
	List<Order> findOrders(
		@QueryValue List<String> states, @QueryValue @Format(Constants.DateFormat.yyyy_MM_dd) LocalDate to
	)

}
