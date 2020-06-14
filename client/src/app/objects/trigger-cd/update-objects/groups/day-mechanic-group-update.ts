import {Dayjs} from "dayjs";
import {MechanicGroupUpdate} from "./mechanic-group-update";
import {GroupUpdate} from "./group-update";
import {Constants} from "../../../constants";
import {DaysTriggerMap} from "../../trigger-maps/days-trigger-map";
import {DayTriggerMapUpdate} from "../trigger-map-update/day-trigger-map-update";

export class DayMechanicGroupUpdate implements DayTriggerMapUpdate {

	type: string;
	day: Dayjs;
	value: GroupUpdate;

	constructor(day: Dayjs, value: GroupUpdate) {
		this.type = Constants.UPDATE_OBJECT.GROUP;
		this.day = day;
		this.value = value;
	}

	updateTriggerMap(
		daysUpdateObjects: DaysTriggerMap,
		day: Dayjs = this.day,
		type: string = this.type,
		groupUpdate: GroupUpdate = this.value
	): void {
		if (day) {
			daysUpdateObjects[day.valueOf()][type] = new MechanicGroupUpdate(
				groupUpdate.value.group.mechanicCode, groupUpdate
			);
		}
		// else {
		// 	for (const day of Object.keys(daysUpdateObjects)) {
		// 		daysUpdateObjects[day][type] = new MechanicLineUpdate(dayMechanic);
		// 	}
		// }
	}

}
