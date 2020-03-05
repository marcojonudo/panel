import {DragScheduleAction} from "./drag-schedule-action";
import {DragScheduleInfo} from "../drag-schedule-info";

export class DragScheduleRemove implements DragScheduleAction {

	dragInfo: DragScheduleInfo;
	sign: number;

	constructor(dragInfo: DragScheduleInfo, sign: number) {
		this.dragInfo = dragInfo;
		this.sign = sign;
	}

	update(dragSchedule: DragScheduleInfo[]): void {
		if (this.sign > 0) {
			dragSchedule.shift();
		} else {
			dragSchedule.pop();
		}
	}

}
