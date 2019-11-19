import {DragScheduleInfo} from "../drag-schedule-info";

export interface DragScheduleAction {

	dragInfo: DragScheduleInfo;
	sign: number;

	update(dragSchedule: DragScheduleInfo[]): void;

}
