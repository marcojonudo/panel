import {AppointmentsCounterUpdate} from "./appointments-counter-update";

export class AppointmentsCounterUpdateInit implements AppointmentsCounterUpdate {

	appointmentTypeCode: string;
	newAppointmentsCounter: any;

	constructor(newAppointmentsCounter: any) {
		this.newAppointmentsCounter = newAppointmentsCounter;
	}

	update(appointmentsCounter: any): void {
		for (const [type, info] of Object.entries(this.newAppointmentsCounter)) {
			for (const [scheduleType, counter] of Object.entries(info)) {
				appointmentsCounter[type][scheduleType] = counter;
			}
			appointmentsCounter[type]['MAX'] = 3;
		}
	}

}
