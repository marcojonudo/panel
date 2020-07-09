import {AppointmentType} from "./appointments/appointment-type";
import {ScheduleInterval} from "./schedule-interval";
import {UtilsService} from "../services/utils.service";
import * as dayjs from "dayjs";
import {Dayjs} from "dayjs";
import {AppointmentsService} from "../services/appointments.service";

export class AppointmentSchedule {

	day: Dayjs;
	mechanicCode: string;
	appointmentType: AppointmentType;
	schedule: ScheduleInterval;

	constructor(
		day: Dayjs,
		mechanicCode: string,
		appointmentType: AppointmentType,
		schedule: ScheduleInterval,
	) {
		this.day = day;
		this.mechanicCode = mechanicCode;
		this.appointmentType = appointmentType;
		this.schedule = schedule;
	}

	static build(mechanicAppointment: any): AppointmentSchedule {
		const day = dayjs(mechanicAppointment.mechanic.day);
		return new AppointmentSchedule(
			day,
			mechanicAppointment.mechanic.employee.code,
			AppointmentsService.findAppointmentType(mechanicAppointment.appointmentTypeCode),
			new ScheduleInterval(
				UtilsService.parseTime(mechanicAppointment.schedule.start, day),
				UtilsService.parseTime(mechanicAppointment.schedule.end, day)
			)
		)
	}

	reset(): void {
		this.appointmentType = undefined;
		this.schedule = undefined;
	}

	equals(appointmentSchedule: AppointmentSchedule): boolean {
		return this.day.isSame(appointmentSchedule.day)
			&& this.mechanicCode == appointmentSchedule.mechanicCode
			&& (this.schedule.start.isSame(appointmentSchedule.schedule.start)
				|| this.schedule.end.isSame(appointmentSchedule.schedule.end));
	}

}
