import {Dayjs} from "dayjs";
import {Constants} from "../../../constants";
import {DaysTriggerMap} from "../../trigger-maps/days-trigger-map";
import {DayTriggerMapUpdate} from "../trigger-map-update/day-trigger-map-update";
import {MechanicGroupUpdate} from "./mechanic-group-update";

export class DayMechanicGroupUpdate implements DayTriggerMapUpdate {

	type: string;
	day: Dayjs;
	value: MechanicGroupUpdate[];

	constructor(day: Dayjs, value: MechanicGroupUpdate) {
		this.type = Constants.UPDATE_OBJECT.GROUPS;
		this.day = day;
		this.value = [value];
	}

	updateTriggerMap(
		daysUpdateObjects: DaysTriggerMap,
		day: Dayjs = this.day,
		type: string = this.type,
		mechanicGroupUpdates: MechanicGroupUpdate[] = this.value
	): void {
		daysUpdateObjects[day.valueOf()][type] = mechanicGroupUpdates;
	}

}
