package panel.pogos.fviberi

import com.fasterxml.jackson.annotation.JsonFormat
import groovy.transform.CompileStatic
import panel.utils.Constants

import java.time.LocalTime

@CompileStatic
class OrderTime {

	String shortCode

	@JsonFormat(pattern = Constants.TimeFormat.HH_mm, timezone = Constants.SPAIN_TIMEZONE)
	LocalTime deadline

	OrderTime(panel.domains.fviberi.OrderTime orderTime) {
		shortCode = orderTime.shortCode
		deadline = orderTime.deadline
	}

}
