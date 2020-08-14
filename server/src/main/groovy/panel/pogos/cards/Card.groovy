package panel.pogos.cards

import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import groovy.transform.CompileStatic
import panel.pogos.fviberi.Order
import panel.serializers.CardMinSerializer
import panel.utils.Constants

import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime

@CompileStatic
class Card {

	Long id
    Group group
	CardType type
	String code

	@JsonFormat(pattern = Constants.DateFormat.yyyy_MM_dd, timezone = Constants.SPAIN_TIMEZONE)
	LocalDate day

	@JsonFormat(pattern = Constants.TimeFormat.HH_mm, timezone = Constants.SPAIN_TIMEZONE)
	LocalTime start

	Integer duration
	String mechanicCode
	Integer line
	Status status

	@JsonSerialize(using = CardMinSerializer)
    Card linkedPrevious

	@JsonSerialize(using = CardMinSerializer)
    Card linkedNext

	@JsonSerialize(using = CardMinSerializer)
    Card dividedPrevious

	@JsonSerialize(using = CardMinSerializer)
    Card dividedNext

	int divisionIndex
	String vehiclePosition
    Pending pending
    OrderInfo order
    VehicleInfo vehicle
	ClientInfo client

	@JsonFormat(pattern = Constants.DateTimeFormat.yyyy_MM_dd_HH_mm_ss, timezone = Constants.SPAIN_TIMEZONE)
	LocalDateTime dateDeleted

	LocalDate lastDay
	String lastMechanicCode
	Integer lastLine
	LocalTime lastStart
	LocalTime lastEnd

	/* Constructor para fichas obtenidas de base de datos */
	@JsonCreator
	Card(Map card) {
		id = (Long) card.id
		code = card.code
		day = card.day ? LocalDate.parse((String) card.day) : null
		group = card.group ? card.group as Group : null
		type = (CardType) card.type
		start = card.start ? LocalTime.parse((String) card.start) : null
		duration = (Integer) card.duration
		mechanicCode = card.mechanicCode
		line = (Integer) card.line
		status = (Status) card.status
		linkedPrevious = card.linkedPrevious ? (Card) card.linkedPrevious : null
		linkedNext = card.linkedNext ? (Card) card.linkedNext : null
		dividedPrevious = card.dividedPrevious ? (Card) card.dividedPrevious : null
		dividedNext = card.dividedNext ? (Card) card.dividedNext : null
		divisionIndex = card.divisionIndex ? (int) card.divisionIndex : 0
		vehiclePosition = card.vehiclePosition
		pending = card.pending ? new Pending((Map) card.pending) : null
		order = card.order ? new OrderInfo((Map) card.order) : null
		client = card.client ? card.client as ClientInfo : null
		vehicle = card.vehicle ? card.vehicle as VehicleInfo : null
		dateDeleted = card.dateDeleted ? LocalDateTime.parse((String) card.dateDeleted) : null
		lastDay = card.lastDay ? LocalDate.parse((String) card.lastDay) : null
		lastMechanicCode = card.lastMechanicCode
		lastLine = (Integer) card.lastLine
		lastStart = card.lastStart ? LocalTime.parse((String) card.lastStart) : null
		lastEnd = card.lastEnd ? LocalTime.parse((String) card.lastEnd) : null
	}

	/* Constructor para la creación de nuevas fichas a partir de la orden y la agrupación */
	Card(Order order, Group group, float units, int duration) {
		code = "${group.unitsInShortName ? units as int : ''}$group.shortName"
		this.group = group
		this.duration = duration
		status = Status.DEFAULT
		pending = new Pending()
		this.order = new OrderInfo(order)
		vehicle = new VehicleInfo(order.vehicle)
		client = new ClientInfo(order.client)
		type = CardType.values().find { ((Closure<Boolean>) it.condition)(this.order.code, this.order.day) }
	}

	enum CardType {

		AUXILIARY({ String orderCode, LocalDate day -> !orderCode }),
		APPOINTMENT({ String orderCode, LocalDate day -> orderCode.startsWith("C") }),
		TODAY({ String orderCode, LocalDate day -> day == LocalDate.now() }),
		PENDING({ String orderCode, LocalDate day -> true })

		final Closure<Boolean> condition

		CardType(Closure<Boolean> condition) {
			this.condition = condition
		}

	}

	enum Status {

		DEFAULT,
		FINISHED,
		AUXILIARY

	}

	@Override
	boolean equals(Object card) {
		card = (Card) card
		return this.order.number == card.order.number &&
				this.group.code == card.group.code &&
				this.divisionIndex == card.divisionIndex
	}

}
