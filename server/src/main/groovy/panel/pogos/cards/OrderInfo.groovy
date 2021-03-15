package panel.pogos.cards

import com.fasterxml.jackson.annotation.JsonFormat
import groovy.transform.CompileStatic
import panel.domains.fviberi.OrderHeader
import panel.pogos.fviberi.Order
import panel.pogos.fviberi.OrderLine
import panel.utils.Constants

import java.time.LocalDate
import java.time.LocalTime

@CompileStatic
class OrderInfo {

	Integer number
	String code
	OrderHeader.State state
	String creatorCode

	@JsonFormat(pattern = Constants.TimeFormat.HH_mm, timezone = Constants.SPAIN_TIMEZONE)
	LocalTime created

	@JsonFormat(pattern = Constants.TimeFormat.HH_mm, timezone = Constants.SPAIN_TIMEZONE)
	LocalTime deadline

	@JsonFormat(pattern = Constants.DateFormat.yyyy_MM_dd, timezone = Constants.SPAIN_TIMEZONE)
	LocalDate day

	List<OrderLine> lines

	/* Constructor para fichas obtenidas de base de datos */
	OrderInfo(Map order) {
		number = (Integer) order.number
		code = order.code
		state = (OrderHeader.State) order.state
		creatorCode = order.creatorCode
		created = order.created ? LocalTime.parse((String) order.created) : null
		deadline = order.deadline ? LocalTime.parse((String) order.deadline) : null
		day = order.day ? LocalDate.parse((String) order.day) : null
//		lines = order.lines.collect { new OrderLine((Map<String, Object>) it) }
	}

	/* Constructor para la creación de nuevas fichas a partir de la orden y la agrupación */
	OrderInfo(Order order) {
		number = order.number
		code = order.timeInfo.shortCode
		state = order.state
		creatorCode = order.creatorCode
		created = order.created
		deadline = order.timeInfo.deadline
		day = order.day
		lines = order.lines
	}

}
