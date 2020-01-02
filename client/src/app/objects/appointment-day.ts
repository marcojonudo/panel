import {UtilsService} from "../services/utils.service";
import {AppointmentType} from "./appointment-type";

export class AppointmentDay {

	appointmentType: AppointmentType;
	day: Date;
	morning: number = 0;
	afternoon: number = 0;
	total: number = 0;
	max: number = 0;

	constructor(appointmentType: any, day: number = undefined, appointmentDay: any = undefined) {
		this.appointmentType = new AppointmentType(appointmentType);
		this.day = day ? UtilsService.parseDateFromLong(day) : undefined;
		if (appointmentDay) {
			this.morning = appointmentDay.morning;
			this.afternoon = appointmentDay.afternoon;
			this.total = appointmentDay.total;
			this.max = appointmentDay.max;
		}
	}

	reset(resetTotal: boolean = false) {
		this.morning = 0;
		this.afternoon = 0;
		if (resetTotal) {
			this.total = 0;
		}
	}

}
