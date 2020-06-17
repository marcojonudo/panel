import {Constants} from "../../../constants";
import {GroupsTriggerMap} from "../../trigger-maps/groups-trigger-map";
import {GroupTriggerMapUpdate} from "../trigger-map-update/group-trigger-map-update";
import {CardsGroup} from "../../../cards-group";

export class GroupUpdate implements GroupTriggerMapUpdate {

	type: string;
	groupId: string;
	value: CardsGroup;

	constructor(groupId: string = undefined, value: CardsGroup = undefined) {
		this.type = Constants.UPDATE_OBJECT.GROUPS;
		this.groupId = groupId;
		this.value = value;
	}

	updateTriggerMap(
		groupsTriggerMap: GroupsTriggerMap,
		groupId: string,
		type: string = this.type,
		group: CardsGroup = this.value
	): void {
		groupsTriggerMap[groupId] = this;
	}

}
