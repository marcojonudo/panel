import {AppointmentsCounterUpdate} from "./appointments-counter-update";

export class AppointmentsCounterUpdateInit implements AppointmentsCounterUpdate {

	appointmentTypeCode: string;
	newDaysAppointmentsCounter: any;

	constructor(newDaysAppointmentsCounter: any) {
		this.newDaysAppointmentsCounter = newDaysAppointmentsCounter;
	}

	update(daysAppointmentsCounter: any): void {
		for (const [type, info] of Object.entries(this.newDaysAppointmentsCounter)) {
			for (const [scheduleType, counter] of Object.entries(info)) {
				daysAppointmentsCounter[type][scheduleType] = counter;
			}
			daysAppointmentsCounter[type]['MAX'] = 3;
		}
	}

}
