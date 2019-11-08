import {Schedule} from "./schedule";
import {AppointmentType} from "./appointment-type";

export class AppointmentSchedule {

	appointmentType: AppointmentType;
	schedule: Schedule;

	constructor(appointmentSchedule: any) {
		this.appointmentType = appointmentSchedule.appointmentType;
		this.schedule = new Schedule(appointmentSchedule.schedule);
	}

}
