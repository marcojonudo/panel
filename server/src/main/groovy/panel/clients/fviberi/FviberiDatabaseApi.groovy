package panel.clients.fviberi

import groovy.transform.CompileStatic
import io.micronaut.http.annotation.QueryValue
import utils.pogos.fviberi.Order

import javax.inject.Singleton

@Singleton
@CompileStatic
interface FviberiDatabaseApi {

	List<Order> getOrders(@QueryValue List<String> states)

}
