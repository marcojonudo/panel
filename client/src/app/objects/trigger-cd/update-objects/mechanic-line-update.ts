import {Constants} from "../../constants";
import {UpdateObject} from "./update-object";
import {MechanicsUpdateObjects} from "../mechanics-update-objects";
import {DayMechanic} from "../day-update/day-mechanic";

export class MechanicLineUpdate implements UpdateObject {

	type: string;
	value: DayMechanic;

	constructor(value: DayMechanic) {
		this.type = Constants.UPDATE_OBJECT.MECHANIC_LINE;
		this.value = value;
	}

	updateObjects(
		processedMechanicCode: string,
		mechanicsUpdateObjects: MechanicsUpdateObjects,
		dayMechanic: DayMechanic = this.value,
		type: string = this.type
	): void {
		if (dayMechanic.mechanicCode) {
			mechanicsUpdateObjects[dayMechanic.mechanicCode][type] = this.value;
		} else {
			for (const key of Object.keys(mechanicsUpdateObjects)) {
				mechanicsUpdateObjects[key][type] = this.value
			}
		}
	}

}
