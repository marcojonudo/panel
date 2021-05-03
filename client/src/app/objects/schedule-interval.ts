import {Dayjs} from "dayjs";
import {Constants} from "./constants";
import {HourQuarters} from "./hour-quarters";

export class ScheduleInterval {

	start: Dayjs;
	end: Dayjs;
	duration: number;
	hourQuarters: HourQuarters[] = [];
	quarters: number[] = [];

	constructor(start: Dayjs, end: Dayjs) {
		this.start = start;
		this.end = end;
		this.duration = this.end.diff(this.start, Constants.DAY_JS.m);

		let time = this.start;
		while (time < this.end) {
			const [hours, minutes] = [time.hour(), time.minute()];
			const hourQuarter = this.hourQuarters.find(hourQuarter => hourQuarter.hour == hours);
			if (hourQuarter) {
				hourQuarter.quarters.push(minutes);
			} else {
				this.hourQuarters.push(new HourQuarters(hours, [minutes]));
			}
			this.quarters.push(minutes);
			time = time.add(Constants.QUARTERS.STEP_15, Constants.DAY_JS.m);
		}
	}

	equals(interval: ScheduleInterval): boolean {
		return this.start.isSame(interval.start) && this.end.isSame(interval.end);
	}

	clone(): ScheduleInterval {
		return new ScheduleInterval(this.start.clone(), this.end.clone());
	}

}
