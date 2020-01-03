import {UtilsService} from "../services/utils.service";
import {Constants} from "./constants";
import {HourQuarters} from "./hour-quarters";
import {ScheduleInterval} from "./schedule-interval";

export class Schedule {

	morningStart: Date;
	morningEnd: Date;
	afternoonStart: Date;
	afternoonEnd: Date;
	type: string;
	start: Date;
	end: Date;
	intervals: ScheduleInterval[] = [];

	constructor(morningStart: string, morningEnd: string, afternoonStart: string, afternoonEnd: string) {
		if (morningStart) {
			this.morningStart = UtilsService.parseTimeFromString(morningStart);
			this.morningEnd = UtilsService.parseTimeFromString(morningEnd);
			this.type = Constants.SCHEDULE_TYPE.MORNING.toUpperCase();
			this.intervals.push(new ScheduleInterval(morningStart, morningEnd));
			this.start = this.morningStart;
			this.end = this.morningEnd;
		}
		if (afternoonStart) {
			this.afternoonStart = UtilsService.parseTimeFromString(afternoonStart);
			this.afternoonEnd = UtilsService.parseTimeFromString(afternoonEnd);
			this.start = this.start ? this.start : this.afternoonStart;
			this.end = this.afternoonEnd;
			this.type = (this.start == this.morningStart
				? Constants.SCHEDULE_TYPE.FULL_TIME : Constants.SCHEDULE_TYPE.AFTERNOON).toUpperCase();
			this.intervals.push(new ScheduleInterval(afternoonStart, afternoonEnd));
		}
	}

}
