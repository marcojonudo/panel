import {Constants} from "../../constants";
import {UpdateObject} from "./update-object";
import {DaysUpdateObjects} from "../days-update-objects";
import {Dayjs} from "dayjs";
import {HourQuarter} from "../../hour-quarter";
import {DaySaturatedQuarters} from "../day-update/day-saturated-quarters";

export class DaySaturatedQuartersUpdate implements UpdateObject {

	type: string;
	value: DaySaturatedQuarters;

	constructor(value: DaySaturatedQuarters) {
		this.type = Constants.UPDATE_OBJECT.SATURATED_QUARTERS;
		this.value = value;
	}

	updateObjects(
		daysUpdateObjects: DaysUpdateObjects,
		day: Dayjs = this.value.day,
		saturatedQuarters: HourQuarter[] = this.value.saturatedQuarters,
		type: string = this.type
	): void {
		daysUpdateObjects[day.valueOf()][type] = saturatedQuarters;
	}

}
