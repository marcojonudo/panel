package panel.pogos.fviberi

import com.fasterxml.jackson.annotation.JsonFormat
import groovy.transform.CompileStatic
import panel.domains.fviberi.OrderHeader
import panel.utils.Constants

import java.time.LocalDate
import java.time.LocalTime

@CompileStatic
class Order {

	int number
	OrderHeader.State state
	String creatorCode

	@JsonFormat(pattern = Constants.TimeFormat.HH_mm, timezone = Constants.SPAIN_TIMEZONE)
	LocalTime created

	@JsonFormat(pattern = Constants.DateFormat.yyyy_MM_dd, timezone = Constants.SPAIN_TIMEZONE)
	LocalDate day
    OrderTime timeInfo
    Client client
    Vehicle vehicle
	List<OrderLine> lines

	Order(OrderHeader order) {
		number = order.number
		state = order.state as OrderHeader.State
		creatorCode = order.creatorCode
		created = order.created
		day = order.day
		timeInfo = new OrderTime(order.timeInfo[0])
		client = new Client(order.client)
		vehicle = new Vehicle(order.vehicle)
		lines = order.lines.collect { new OrderLine(it) }
	}

}
