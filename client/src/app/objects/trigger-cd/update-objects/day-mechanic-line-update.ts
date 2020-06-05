import {Constants} from "../../constants";
import {UpdateObject} from "./update-object";
import {DayMechanic} from "../day-update/day-mechanic";
import {DaysUpdateObjects} from "../days-update-objects";
import {Dayjs} from "dayjs";
import {MechanicLineUpdate} from "./mechanic-line-update";

export class DayMechanicLineUpdate implements UpdateObject {

	type: string;
	value: DayMechanic;

	constructor(value: DayMechanic) {
		this.type = Constants.UPDATE_OBJECT.MECHANIC_LINE;
		this.value = value;
	}

	updateObjects(
		daysUpdateObjects: DaysUpdateObjects,
		day: Dayjs = this.value.day,
		dayMechanic: DayMechanic = this.value,
		type: string = this.type
	): void {
		if (day) {
			daysUpdateObjects[day.valueOf()][type] = new MechanicLineUpdate(dayMechanic);
		} else {
			for (const key of Object.keys(daysUpdateObjects)) {
				daysUpdateObjects[key][type] = new MechanicLineUpdate(dayMechanic);
			}
		}
	}

}
