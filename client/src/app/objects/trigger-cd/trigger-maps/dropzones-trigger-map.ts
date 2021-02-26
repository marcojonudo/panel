import {TriggerMap} from "./trigger-map";
import {DropzoneUpdate} from "../update-objects/mechanic-line/dropzone-update";
import {ScheduleInterval} from "../../schedule-interval";

export class DropzonesTriggerMap implements TriggerMap {

	[key: number]: DropzoneUpdate;

	constructor(schedules: ScheduleInterval[]) {
		schedules.forEach((schedule: ScheduleInterval) => {
			this[schedule.start.valueOf()] = undefined;
		});
	}

}
