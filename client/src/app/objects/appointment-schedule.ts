import {AppointmentType} from "./appointment-type";
import {ScheduleInterval} from "./schedule-interval";
import {Mechanic} from "./mechanic";
import {UtilsService} from "../services/utils.service";
import * as dayjs from "dayjs";
import {Dayjs} from "dayjs";

export class AppointmentSchedule {

	day: Dayjs;
	mechanicCode: string;
	// id: string;
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
		// this.id = this.buildId(mechanic.day, mechanic.code, start);
		this.appointmentType = appointmentType;
		this.schedule = schedule;
	}

	// buildId(day: Date, mechanicCode: string, start: string): string {
	// 	return `${UtilsService.formatDay(day)}-${mechanicCode}-${start}`;
	// }

	reset(): void {
		this.appointmentType = undefined;
		this.schedule = undefined;
	}

	equals(appointmentSchedule: AppointmentSchedule): boolean {
		return this.day.isSame(appointmentSchedule.day)
			&& this.mechanicCode == appointmentSchedule.mechanicCode
			&& this.schedule.start.isSame(appointmentSchedule.schedule.start);
	}

}
