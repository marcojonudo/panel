import { Dayjs } from "dayjs";
import { Constants } from '../constants';
import { HourQuarters } from '../hour-quarters';

export class ScheduleInterval2 {

	start: Dayjs;
	end: Dayjs;
	duration: number;
	hourQuarters: HourQuarters[] = [];
	quarters: number[] = [];

	constructor(day: Dayjs, interval: any) {
		const startInfo = interval.start.split(':')
		const endInfo = interval.end.split(':')
		this.start = day.clone().set(Constants.DAY_JS.h, startInfo[0]).set(Constants.DAY_JS.m, startInfo[1]);
		this.end = day.clone().set(Constants.DAY_JS.h, endInfo[0]).set(Constants.DAY_JS.m, endInfo[1]);

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

	equals(interval: ScheduleInterval2): boolean {
		return this.start.isSame(interval.start) && this.end.isSame(interval.end);
	}

	clone(): ScheduleInterval2 {
		return undefined;
		// return new ScheduleInterval2(this.start.clone(), this.end.clone());
	}

}
