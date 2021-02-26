import {Dayjs} from "dayjs";
import {Constants} from "../../../constants";
import {DayTriggerMapUpdate} from "../trigger-map-update/day-trigger-map-update";
import {MechanicTriggerMapUpdate} from "../trigger-map-update/mechanic-trigger-map-update";
import {DaysTriggerMap} from "../../trigger-maps/days-trigger-map";

export class DayMechanicLineUpdate implements DayTriggerMapUpdate {

	type: string;
	day: Dayjs;
	value: MechanicTriggerMapUpdate[];

	constructor(day: Dayjs, value: MechanicTriggerMapUpdate) {
		this.type = Constants.UPDATE_OBJECT.MECHANIC_LINE;
		this.day = day;
		this.value = [value];
	}

	updateTriggerMap(
		daysUpdateObjects: DaysTriggerMap,
		day: Dayjs = this.day,
		type: string = this.type,
		mechanicTriggerMapUpdates: MechanicTriggerMapUpdate[] = this.value
	): void {
		/* Si la actualización de líena tiene un día definido, se modifica únicamente el valor de ese día */
		if (day) {
			daysUpdateObjects[day.valueOf()][type] = [];
			mechanicTriggerMapUpdates.forEach((mechanicTriggerMapUpdate: MechanicTriggerMapUpdate) => {
				daysUpdateObjects[day.valueOf()][type].push(mechanicTriggerMapUpdate);
			});
		} else {
			/* Si no, significa que se quieren actualizar todos los días */
			for (const day of Object.keys(daysUpdateObjects)) {
				daysUpdateObjects[day][type] = [];
				mechanicTriggerMapUpdates.forEach((mechanicTriggerMapUpdate: MechanicTriggerMapUpdate) => {
					daysUpdateObjects[day][type].push(mechanicTriggerMapUpdate);
				});
			}
		}
	}

}
