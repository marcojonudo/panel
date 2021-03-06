package panel.utils

import groovy.transform.CompileStatic
import panel.domains.panel.*
import panel.pogos.fviberi.Order

import java.time.LocalDate

@CompileStatic
class Builder {

	static Card buildCard(Order order, Group group, float units, int duration) {
		return new Card(
			code: "${group.unitsInShortName ? units as int : ''}$group.shortName",
			group: group,
			duration: duration,
			status: Card.Status.DEFAULT,
			pending: new Pending(),
			order: new OrderInfo(
				number: order.number,
				code: order.timeInfo.shortCode,
				state: order.state,
				creatorCode: order.creatorCode,
				created: order.created,
				deadline: order.timeInfo.deadline,
				day: order.day,
				lines: order.lines,
			),
			vehicle: new VehicleInfo(
				numberPlate: order.vehicle.numberPlate ?: null,
				brand: order.vehicle.brand ?: null,
				model: order.vehicle.model ?: null,
				cylinder: order.vehicle.cylinder ?: null,
				color: order.vehicle.color ?: null,
			),
			client: new ClientInfo(
				code: order.client.code,
				name: order.client.name,
				surnames: order.client.surnames,
				phoneNumber: order.client.phoneNumber
			),
			type: Card.CardType.values().find { ((Closure<Boolean>) it.condition)(order.timeInfo.shortCode, order.day) }
		)
	}

	static AppointmentDay buildAppointmentDay(LocalDate day, List<AppointmentType> appointmentTypes) {
		AppointmentDay appointmentDay = new AppointmentDay(day: day)
		appointmentDay.values = (Set<AppointmentTypeValues>) appointmentTypes.collect {
			new AppointmentTypeValues(appointmentDay: appointmentDay, appointmentType: it)
		}
		return appointmentDay
	}

}
