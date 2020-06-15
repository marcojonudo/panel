import {TriggerMap} from "./trigger-maps/trigger-map";
import {CardsGroup} from "../cards-group";
import {GroupUpdate} from "./update-objects/groups/group-update";

export class GroupsTriggerMap implements TriggerMap {

	[key: string]: GroupUpdate;

	constructor(groups: CardsGroup[]) {
		groups.forEach((group: CardsGroup) => {
			this[group.id] = undefined;
		});
	}

}
