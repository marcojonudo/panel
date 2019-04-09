package panel.clients.panel

import groovy.transform.CompileStatic
import io.micronaut.core.convert.format.Format
import io.micronaut.http.annotation.Body
import io.micronaut.http.annotation.QueryValue
import utils.pogos.panel.GroupUnits

import javax.inject.Singleton

@Singleton
@CompileStatic
interface PanelDatabaseApi {

	List<Map> getTasks(@QueryValue List<Integer> articles)
	List<Map> getCards(@QueryValue @Format("yyyy-mm-dd") Date day)
	List<Integer> getDurations(@Body List<GroupUnits> groupUnits)

}
