package panel.pogos.fviberi

import com.fasterxml.jackson.annotation.JsonFormat
import groovy.transform.CompileStatic
import panel.utils.Constants

import java.time.LocalDate
import java.time.LocalTime

@CompileStatic
class Order {

	int number
	State state
	String creatorCode

	@JsonFormat(pattern = Constants.TimeFormat.HH_mm, timezone = Constants.SPAIN_TIMEZONE)
	LocalTime created

	@JsonFormat(pattern = Constants.DateFormat.yyyy_MM_dd, timezone = Constants.SPAIN_TIMEZONE)
	LocalDate day
    OrderTime timeInfo
    Client client
    Vehicle vehicle
	List<OrderLine> lines

	enum State {

		A,
		C,
		E,
		P,
		V,
		X

	}

}
