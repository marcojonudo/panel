import {UtilsService} from "../services/utils.service";
import {Constants} from "./constants";
import {HourQuarters} from "./hour-quarters";

export class Schedule {

	id: number;
	morningStart: Date;
	morningEnd: Date;
	afternoonStart: Date;
	afternoonEnd: Date;
	type: string;
	thresholds: Date[] = [];
	start: Date;
	end: Date;
	minutes: number[] = [];
	quarters: number[][] = [];
	hourQuarters: HourQuarters[][] = [];

	constructor(morningStart: string, morningEnd: string, afternoonStart: string, afternoonEnd: string, id: number = undefined) {
		this.id = id;
		if (morningStart) {
			this.morningStart = UtilsService.parseTimeFromString(morningStart);
			this.morningEnd = UtilsService.parseTimeFromString(morningEnd);
			this.thresholds.push(this.morningStart, this.morningEnd);
			this.type = Constants.SCHEDULE_TYPE.MORNING;
		}
		if (afternoonStart) {
			this.afternoonStart = UtilsService.parseTimeFromString(afternoonStart);
			this.afternoonEnd = UtilsService.parseTimeFromString(afternoonEnd);
			this.thresholds.push(this.afternoonStart, this.afternoonEnd);
			this.type = this.thresholds.length > 2 ? Constants.SCHEDULE_TYPE.FULL_TIME : Constants.SCHEDULE_TYPE.AFTERNOON;
		}
		this.start = this.thresholds[0];
		this.end = this.thresholds[this.thresholds.length-1];

		for (let i = 0; i < this.thresholds.length; i = i + 2) {
			this.hourQuarters.push([]);
			this.minutes.push(UtilsService.getScheduleMinutes(this.thresholds[i], this.thresholds[i+1]));
			const [startMinutes, endMinutes] = [
				UtilsService.getTotalMinutes(this.thresholds[i]), UtilsService.getTotalMinutes(this.thresholds[i+1])
			];
			for (let minutes = startMinutes; minutes < endMinutes; minutes = minutes + 15) {
				const quarterTime = UtilsService.parseTimeFromMinutes(minutes, this.thresholds[i]);
				const [hours, mins] = [quarterTime.getHours(), quarterTime.getMinutes()];
				const hourQuarter = this.hourQuarters[i/2].find(hourQuarter => hourQuarter.hour == hours);
				if (hourQuarter) {
					hourQuarter.quarters.push(mins);
				} else {
					this.hourQuarters[i/2].push(
						new HourQuarters(
							hours,
							[mins],
							this.type != Constants.SCHEDULE_TYPE.FULL_TIME
								? this.type
								: (i == 0 ? Constants.SCHEDULE_TYPE.MORNING : Constants.SCHEDULE_TYPE.AFTERNOON)
						)
					);
				}
			}
			const startMinutes2 = this.thresholds[i].getMinutes();
			this.quarters.push(UtilsService.createArray(this.minutes[i/2] / 15).map((elem, i) => {
				return (startMinutes2 + 15 * i) % 60;
			}));
		}
	}

}
