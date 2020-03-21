import {UtilsService} from "../services/utils.service";
import {Constants} from "./constants";
import {HourQuarters} from "./hour-quarters";
import {Dayjs} from "dayjs";

export class ScheduleInterval {

	start: Dayjs;
	end: Dayjs;
	type: string;
	duration: number;
	hourQuarters: HourQuarters[] = [];
	quarters: number[] = [];

	constructor(start: Dayjs, end: Dayjs) {
		this.start = start;
		this.end = end;
		this.type = UtilsService.findScheduleType(this.start, this.end);
		this.duration = this.end.diff(this.start, Constants.DAY_JS.m);

		let time = this.start;
		while (time < this.end) {
			const [hours, minutes] = [time.hour(), time.minute()];
			const hourQuarter = this.hourQuarters.find(hourQuarter => hourQuarter.hour == hours);
			if (hourQuarter) {
			} else {
				this.hourQuarters.push(new HourQuarters(hours, [minutes], this.type));
			}
			this.quarters.push(minutes);
			time = time.add(Constants.QUARTERS.STEP_15, Constants.DAY_JS.m);
		}
	}

	setEnd(end: Dayjs): void {
		this.end = end;
		this.duration = this.end.diff(this.start, Constants.DAY_JS.m);
	}

}
