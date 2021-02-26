import {Dayjs} from "dayjs";
import {Constants} from "../../../constants";
import {HourQuarter} from "../../../hour-quarter";
import {DayTriggerMapUpdate} from "../trigger-map-update/day-trigger-map-update";
import {DaysTriggerMap} from "../../trigger-maps/days-trigger-map";

export class DaySaturatedQuartersUpdate implements DayTriggerMapUpdate {

	type: string;
	day: Dayjs;
	value: HourQuarter[];

	constructor(day: Dayjs, value: HourQuarter[]) {
		this.type = Constants.UPDATE_OBJECT.SATURATED_QUARTERS;
		this.day = day;
		this.value = value;
	}

	updateTriggerMap(
		daysUpdateObjects: DaysTriggerMap,
		day: Dayjs = this.day,
		type: string = this.type,
		saturatedQuarters: HourQuarter[] = this.value
	): void {
		daysUpdateObjects[day.valueOf()][type] = saturatedQuarters;
	}

}
