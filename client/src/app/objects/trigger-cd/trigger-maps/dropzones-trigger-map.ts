import {TriggerMap} from "./trigger-map";
import {DropzoneUpdate} from "../update-objects/mechanic-line/dropzone-update";
import {ScheduleInterval} from "../../schedule-interval";

export class DropzonesTriggerMap implements TriggerMap {

	[key: number]: DropzoneUpdate;

	constructor(intervals: ScheduleInterval[]) {
		intervals.forEach((interval: ScheduleInterval) => {
			this[interval.start.valueOf()] = undefined;
		});
	}

}
