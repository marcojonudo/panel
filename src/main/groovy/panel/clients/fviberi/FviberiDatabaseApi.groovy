package panel.clients.fviberi

import groovy.transform.CompileStatic
import io.micronaut.core.convert.format.Format
import io.micronaut.http.annotation.QueryValue

import javax.inject.Singleton

@Singleton
@CompileStatic
interface FviberiDatabaseApi {

	List<Map> getOrders(@QueryValue @Format("yyyy-mm-dd") Date day, @QueryValue List<String> states)

}
