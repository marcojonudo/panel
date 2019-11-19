import {DragScheduleAction} from "./drag-schedule-action";
import {DragScheduleInfo} from "../drag-schedule-info";

export class DragScheduleAdd implements DragScheduleAction {

	dragInfo: DragScheduleInfo;
	sign: number;

	constructor(dragInfo: DragScheduleInfo, sign: number = 0) {
		this.dragInfo = dragInfo;
		this.sign = sign;
	}

	update(dragSchedule: DragScheduleInfo[]): void {
		if (this.sign == 0) {
			dragSchedule.splice(0, dragSchedule.length);
			dragSchedule.push(this.dragInfo);
		} else if (this.sign > 0) {
			dragSchedule.push(this.dragInfo);
		} else {
			dragSchedule.unshift(this.dragInfo);
		}
	}

}
