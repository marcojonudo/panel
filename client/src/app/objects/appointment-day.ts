import {UtilsService} from "../services/utils.service";
import {AppointmentType} from "./appointment-type";

export class AppointmentDay {

	appointmentType: AppointmentType;
	day: Date;
	morning: number;
	afternoon: number;
	max: number;

	constructor(appointmentDay: any) {
		this.appointmentType = new AppointmentType(appointmentDay.appointmentType);
		this.day = UtilsService.parseDateFromLong(appointmentDay.day);
		this.morning = appointmentDay.morning;
		this.afternoon = appointmentDay.afternoon;
		this.max = appointmentDay.max;
	}

}
