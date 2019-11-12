import {UtilsService} from "../services/utils.service";
import {Constants} from "./constants";

export class Schedule {

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
	hours: number[][] = [];

	constructor(schedule: any) {
		if (schedule.morningStart) {
			this.morningStart = UtilsService.parseTimeFromString(schedule.morningStart);
			this.morningEnd = UtilsService.parseTimeFromString(schedule.morningEnd);
			this.thresholds.push(this.morningStart, this.morningEnd);
			this.type = Constants.SCHEDULE_TYPE.MORNING;
		}
		if (schedule.afternoonStart) {
			this.afternoonStart = UtilsService.parseTimeFromString(schedule.afternoonStart);
			this.afternoonEnd = UtilsService.parseTimeFromString(schedule.afternoonEnd);
			this.thresholds.push(this.afternoonStart, this.afternoonEnd);
			this.type = this.thresholds.length > 2 ? Constants.SCHEDULE_TYPE.FULL_TIME : Constants.SCHEDULE_TYPE.AFTERNOON;
		}
		this.start = this.thresholds[0];
		this.end = this.thresholds[this.thresholds.length-1];

		for (let i = 0; i < this.thresholds.length; i = i + 2) {
			this.minutes.push(UtilsService.getScheduleMinutes(this.thresholds[i], this.thresholds[i+1]));
			const startHours = this.thresholds[i].getHours();
			const startMinutes = this.thresholds[i].getMinutes();
			this.hours.push(UtilsService.createArray(Math.ceil(this.minutes[i/2]/60)).map((elem, i) => {
				return startHours + i;
			}));
			this.quarters.push(UtilsService.createArray(this.minutes[i/2] / 15).map((elem, i) => {
				return (startMinutes + 15 * i) % 60;
			}));
		}
	}

}
