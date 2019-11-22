import {Pipe, PipeTransform} from '@angular/core';
import {AppointmentSchedule} from "../objects/appointment-schedule";

@Pipe({
	name: 'appointments'
})
export class AppointmentsPipe implements PipeTransform {

	transform(appointments: AppointmentSchedule[], args?: any): any {
		return appointments.filter(appointment => appointment.schedule);
	}

}
