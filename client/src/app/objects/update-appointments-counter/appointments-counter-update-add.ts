import {AppointmentsCounterUpdate} from "./appointments-counter-update";

export class AppointmentsCounterUpdateAdd implements AppointmentsCounterUpdate {

	appointmentTypeCode: string;
	newAppointmentsCounter: any;

	constructor(newAppointmentsCounter: any) {
		this.newAppointmentsCounter = newAppointmentsCounter;
	}

	update(appointmentsCounter: any): void {

	}

}
