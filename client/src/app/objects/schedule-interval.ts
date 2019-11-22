import {UtilsService} from "../services/utils.service";
import {Constants} from "./constants";
import {HourQuarters} from "./hour-quarters";

export class ScheduleInterval {

	start: Date;
	end: Date;
	type: string;
	duration: number;
	hourQuarters: HourQuarters[] = [];
	quarters: number[] = [];

	constructor(start: string, end: string) {
		this.start = UtilsService.parseTimeFromString(start);
		this.end = UtilsService.parseTimeFromString(end);
		this.type = this.start < UtilsService.parseTimeFromMinutes(Constants.TIME_14_00_MINUTES)
			? Constants.SCHEDULE_TYPE.MORNING
			: Constants.SCHEDULE_TYPE.AFTERNOON;
		this.duration = UtilsService.getScheduleMinutes(this.start, this.end);

		let time = this.start;
		while (time < this.end) {
			const [hours, minutes] = [time.getHours(), time.getMinutes()];
			const hourQuarter = this.hourQuarters.find(hourQuarter => hourQuarter.hour == hours);
			if (hourQuarter) {
				hourQuarter.quarters.push(minutes);
			} else {
				this.hourQuarters.push(new HourQuarters(hours, [minutes], this.type));
			}
			this.quarters.push(minutes);
			time = UtilsService.addMinutes(time, Constants.QUARTERS.STEP_15);
		}
	}

}
