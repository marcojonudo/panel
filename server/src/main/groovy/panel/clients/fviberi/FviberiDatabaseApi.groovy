package panel.clients.fviberi

import groovy.transform.CompileStatic
import io.micronaut.http.annotation.QueryValue

import javax.inject.Singleton

@Singleton
@CompileStatic
interface FviberiDatabaseApi {

	List<Map> getOrders(@QueryValue List<String> states)

}
