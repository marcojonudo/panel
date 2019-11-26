import {AppointmentsCounterUpdate} from "./appointments-counter-update";

export class AppointmentsCounterUpdateAdd implements AppointmentsCounterUpdate {

	appointmentTypeCode: string;
	newDaysAppointmentsCounter: any;

	constructor(newAppointmentsCounter: any) {
		this.newDaysAppointmentsCounter = newAppointmentsCounter;
	}

	update(appointmentsCounter: any): void {

	}

}
