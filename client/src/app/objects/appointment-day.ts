import {AppointmentType} from "./appointment-type";
import * as dayjs from "dayjs";
import {Card} from "./card";
import {Dayjs} from "dayjs";

export class AppointmentDay {

	appointmentType: AppointmentType;
	day: Dayjs;
	morning: string[];
	afternoon: string[];
	total: string[];
	max: number = 0;

	// constructor(appointmentType: any, day: number, appointmentDay: any) {
	// 	this.appointmentType = new AppointmentType(appointmentType);
	// 	this.day = day ? UtilsService.parseDateFromLong(day) : undefined;
	// 	if (appointmentDay) {
	// 		this.morning = appointmentDay.morning;
	// 		this.afternoon = appointmentDay.afternoon;
	// 		this.total = appointmentDay.total;
	// 		this.max = appointmentDay.max;
	// 	}
	// }

	constructor(day: Dayjs, appointmentDay: any) {
		this.day = day;
		this.appointmentType = new AppointmentType(appointmentDay.appointmentType);
		this.morning = [];
		this.afternoon = [];
		this.total = [];
		// this.morning = appointmentDay.morning;
		// this.afternoon = appointmentDay.afternoon;
		// this.total = appointmentDay.total;
		this.max = appointmentDay.max;
	}

	addAppointmentCard(cardId: string, scheduleType: string): void {
		this[scheduleType.toLowerCase()].push(cardId);
		this.total.push(cardId);
	}

	reset(resetTotal: boolean = false) {
		// this.morning = 0;
		// this.afternoon = 0;
		// if (resetTotal) {
		// 	this.total = 0;
		// }
	}

}
