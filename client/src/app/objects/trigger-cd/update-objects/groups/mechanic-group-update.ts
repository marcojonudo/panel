import {Constants} from "../../../constants";
import {MechanicsTriggerMap} from "../../trigger-maps/mechanics-trigger-map";
import {MechanicTriggerMapUpdate} from "../trigger-map-update/mechanic-trigger-map-update";
import {GroupTriggerMapUpdate} from "../trigger-map-update/group-trigger-map-update";
import {GroupUpdate} from "./group-update";

export class MechanicGroupUpdate implements MechanicTriggerMapUpdate {

	type: string;
	mechanicCode: string;
	value: GroupUpdate[];

	constructor(mechanicCode: string = undefined, value: GroupTriggerMapUpdate = undefined) {
		this.type = Constants.UPDATE_OBJECT.GROUPS;
		this.mechanicCode = mechanicCode;
		this.value = [value];
	}

	updateTriggerMap(
		mechanicsTriggerMap: MechanicsTriggerMap,
		mechanicCode: string,
		type: string = this.type,
		groups: GroupUpdate[] = this.value
	): void {
		mechanicsTriggerMap[mechanicCode][type] = this.value;
	}

}
