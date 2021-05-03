import {AppointmentType} from "./appointment-type";
import {Dayjs} from "dayjs";
import * as dayjs from "dayjs";
import {AppointmentDay} from "./appointment-day";

export class AppointmentTypeValues {

	appointmentDay: AppointmentDay;
	appointmentType: AppointmentType;
	morning: number;
	afternoon: number;
	total: number;
	max: number;

	constructor(values: any) {
		this.appointmentDay = values.appointmentDay ? new AppointmentDay(values.appointmentDay) : undefined;
		this.appointmentType = values.appointmentType ? new AppointmentType(values.appointmentType) : undefined;
		this.morning = values.morning;
		this.afternoon = values.afternoon;
		this.total = values.total;
		this.max = values.max;
	}

}
