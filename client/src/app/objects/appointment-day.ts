import {UtilsService} from "../services/utils.service";
import {AppointmentType} from "./appointment-type";

export class AppointmentDay {

	appointmentType: AppointmentType;
	day: Date;
	max: number;

	constructor(appointmentDay: any) {
		this.appointmentType = new AppointmentType(appointmentDay.appointmentType);
		this.day = UtilsService.parseDateFromLong(appointmentDay.day);
		this.max = appointmentDay.max;
	}

}
