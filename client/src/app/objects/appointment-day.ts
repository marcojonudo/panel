import {AppointmentType} from "./appointment-type";
import * as dayjs from "dayjs";
import {Constants} from "./constants";

export class AppointmentDay {

	appointmentType: AppointmentType;
	day: any;
	morning: number = 0;
	afternoon: number = 0;
	total: number = 0;
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

	constructor(appointmentDay: any) {
		this.appointmentType = new AppointmentType(appointmentDay.appointmentType);
		this.day = appointmentDay.day ? dayjs(appointmentDay.day) : undefined;
		this.morning = appointmentDay.morning;
		this.afternoon = appointmentDay.afternoon;
		this.total = appointmentDay.total;
		this.max = appointmentDay.max;
	}

	reset(resetTotal: boolean = false) {
		this.morning = 0;
		this.afternoon = 0;
		if (resetTotal) {
			this.total = 0;
		}
	}

}
