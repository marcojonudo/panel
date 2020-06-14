import {Constants} from "../../../constants";
import {GroupsUpdateObjects} from "../../groups-update-objects";
import {DayGroup} from "./day-group";

export class GroupUpdate {

	type: string;
	key: string;
	value: DayGroup;

	constructor(type: string = undefined, value: DayGroup = undefined) {
		this.type = type;
		this.value = value;
	}

	updateObjects(
		groupsUpdateObjects: GroupsUpdateObjects,
		groupId: string,
		type: string = this.type,
		dayGroup: DayGroup = this.value
	): void {
		if (this.type == Constants.UPDATE_OBJECT.REMOVE_GROUP) {
			delete groupsUpdateObjects[groupId];
		} else {
			groupsUpdateObjects[groupId] = dayGroup;
		}
	}

}
