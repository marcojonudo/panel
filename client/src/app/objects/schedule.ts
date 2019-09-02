import {UtilsService} from "../services/utils.service";
import {Constants} from "./constants";

export class Schedule {

	morningStart: Date;
	morningEnd: Date;
	afternoonStart: Date;
	afternoonEnd: Date;

	constructor(schedule: any) {
		if (!(schedule.type == Constants.MORNING)) {
			this.afternoonStart = UtilsService.parseTimeFromString(schedule.afternoonStart);
			this.afternoonEnd = UtilsService.parseTimeFromString(schedule.afternoonEnd);
		}
		if (!(schedule.type == Constants.AFTERNOON)) {
			this.morningStart = UtilsService.parseTimeFromString(schedule.morningStart);
			this.morningEnd = UtilsService.parseTimeFromString(schedule.morningEnd);
		}
	}

}
