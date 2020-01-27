import {Pipe, PipeTransform} from '@angular/core';
import {Mechanic} from "../objects/mechanic";
import {AppointmentSchedule} from "../objects/appointment-schedule";

@Pipe({
	name: 'mechanics'
})
export class MechanicsPipe implements PipeTransform {

	transform(mechanics: Mechanic[], onlyAppointmentsMode: boolean): Mechanic[] {
		return onlyAppointmentsMode ? mechanics.filter((mechanic: Mechanic) =>
			mechanic.appointments.find((appointment: AppointmentSchedule) =>
				appointment.appointmentType != undefined
			) != undefined
		) : mechanics;
	}

}
