import {Dayjs} from "dayjs";
import * as dayjs from "dayjs";
import {AppointmentTypeValues} from "./appointment-type-values";

export class AppointmentDay {

	day: Dayjs;
	values: AppointmentTypeValues[];

	constructor(appointmentDay: any) {
		this.day = dayjs(appointmentDay.day);
		this.values = appointmentDay.values.map(values => new AppointmentTypeValues(values))
	}

	reset(resetTotal: boolean = false) {
		// this.morning = 0;
		// this.afternoon = 0;
		// if (resetTotal) {
		// 	this.total = 0;
		// }
	}

}
