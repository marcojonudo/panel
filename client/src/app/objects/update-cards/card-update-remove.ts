import {CardsGroup} from "../cards-group";
import {CardUpdate} from "./card-update";

export class CardUpdateRemove implements CardUpdate {

	newGroup: CardsGroup;

	constructor(newGroup: CardsGroup) {
		this.newGroup = newGroup;
	}

	update(groups: CardsGroup[]): void {
		const removedGroupIndex = groups.findIndex(group => group.id == this.newGroup.id);
		groups.splice(removedGroupIndex, 1);
	}

}
