import {AppointmentType} from "./appointment-type";
import {ScheduleInterval} from "./schedule-interval";
import {Mechanic} from "./mechanic";
import {UtilsService} from "../services/utils.service";

export class AppointmentSchedule {

	day: Date;
	mechanicCode: string;
	id: string;
	appointmentType: AppointmentType;
	schedule: ScheduleInterval;

	constructor(
		mechanic: Mechanic,
		appointmentType: AppointmentType,
		start: string,
		end: string
	) {
		this.day = mechanic.day;
		this.mechanicCode = mechanic.code;
		this.id = this.buildId(mechanic.day, mechanic.code, start);
		console.log(this.id);
		this.appointmentType = appointmentType;
		this.schedule = new ScheduleInterval(start, end);
	}

	buildId(day: Date, mechanicCode: string, start: string): string {
		return `${UtilsService.formatDay(day)}-${mechanicCode}-${start}`;
	}

	reset(): void {
		this.appointmentType = undefined;
		this.schedule = undefined;
	}

}
