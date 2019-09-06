import {UtilsService} from "../services/utils.service";
import {Constants} from "./constants";

export class Schedule {

	morningStart: Date;
	morningEnd: Date;
	afternoonStart: Date;
	afternoonEnd: Date;
	thresholds: Date[] = [];
	start: Date;
	end: Date;
	minutes: number[] = [];
	quarters: number[][] = [];

	constructor(schedule: any) {
		if (schedule.morningStart) {
			this.morningStart = UtilsService.parseTimeFromString(schedule.morningStart);
			this.morningEnd = UtilsService.parseTimeFromString(schedule.morningEnd);
			this.thresholds.push(this.morningStart, this.morningEnd);
		}
		if (schedule.afternoonStart) {
			this.afternoonStart = UtilsService.parseTimeFromString(schedule.afternoonStart);
			this.afternoonEnd = UtilsService.parseTimeFromString(schedule.afternoonEnd);
			this.thresholds.push(this.afternoonStart, this.afternoonEnd);
		}
		this.start = this.thresholds[0];
		this.end = this.thresholds[this.thresholds.length-1];

		for (let i = 0; i < this.thresholds.length; i = i + 2) {
			this.minutes.push(UtilsService.getScheduleMinutes(this.thresholds[i], this.thresholds[i+1]));
			const startMinutes = this.thresholds[i].getMinutes();
			this.quarters.push(UtilsService.createArray(this.minutes[i/2] / 15).map((elem, i) => {
				return (startMinutes + 15 * i) % 60;
			}));
		}
	}

}
