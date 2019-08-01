package panel.clients.panel

import groovy.transform.CompileStatic
import io.micronaut.core.convert.format.Format
import io.micronaut.http.annotation.Body
import io.micronaut.http.annotation.QueryValue
import panel.utils.Constants
import utils.pogos.panel.Card
import utils.pogos.panel.GroupUnits

import javax.inject.Singleton

@Singleton
@CompileStatic
interface PanelDatabaseApi {

	List<Map> getTasks(@QueryValue List<Integer> articles)
	List<Map> getCards(@QueryValue @Format(Constants.DATE_DB_PATTERN) Date day)
	Map<Integer, List<Map>> getDurations(@Body Map<Integer, List<GroupUnits>> ordersGroupsUnits)
	List<Map> createCards(@Body List<Card> cards)
	List<Map> updateCards(@Body List<Card> cards)
	void deleteCards(@Body List<Long> ids)

}
