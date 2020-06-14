import {GroupUpdate} from "./group-update";
import {Constants} from "../../../constants";
import {MechanicsTriggerMap} from "../../trigger-maps/mechanics-trigger-map";
import {MechanicTriggerMapUpdate} from "../trigger-map-update/mechanic-trigger-map-update";

export class MechanicGroupUpdate implements MechanicTriggerMapUpdate {

	type: string;
	mechanicCode: string;
	value: GroupUpdate;

	constructor(mechanicCode: string = undefined, value: GroupUpdate) {
		this.type = Constants.UPDATE_OBJECT.GROUP;
		this.mechanicCode = mechanicCode;
		this.value = value;
	}

	updateTriggerMap(
		mechanicsTriggerMap: MechanicsTriggerMap,
		mechanicCode: string,
		type: string = this.type,
		groupUpdate: GroupUpdate = this.value
	): void {
		if (this.mechanicCode == mechanicCode) {
			mechanicsTriggerMap[mechanicCode][type] = this.value;
		}
		// if (groupUpdate.value && groupUpdate.value.group.mechanicCode == mechanicCode) {
		// 	mechanicsTriggerMap[mechanicCode][type] = this.value;
		// }




		// if (group.cards[0].mechanicCode) {
		// 	mechanicsTriggerMap[dayMechanic.mechanicCode][type] = this.value;
		// } else {
		// 	for (const mechanicCode of Object.keys(mechanicsTriggerMap)) {
		// 		mechanicsTriggerMap[mechanicCode][type] = this.value
		// 	}
		// }
	}

}
