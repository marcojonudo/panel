package panel.utils

import groovy.transform.CompileStatic
import utils.DateTimeFormat

import java.text.SimpleDateFormat

@CompileStatic
class Url {

	static String dayMechanics(Date dayDate) {
		String day = new SimpleDateFormat(DateTimeFormat.MYSQL_DATE.format).format(dayDate)
		return "$Constants.Url.GET_DAY_MECHANICS?day=$day"
	}

	static String orders(Date dayDate, List<String> statesList) {
		String day = new SimpleDateFormat(DateTimeFormat.MYSQL_DATE.format).format(dayDate)
		String states = statesList.join("&states=")
		return "$Constants.Url.GET_ORDERS?day=$day&states=$states"
	}

	static String cards(Date dayDate) {
		String day = new SimpleDateFormat(DateTimeFormat.MYSQL_DATE.format).format(dayDate)
		return "$Constants.Url.GET_CARDS?day=$day"
	}

	static String tasks(List<Integer> articlesList) {
		String articles = articlesList.join("&articles=")
		return "$Constants.Url.GET_TASKS?articles=$articles"
	}

}
