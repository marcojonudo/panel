import {CardsGroup} from "../cards-group";
import {CardUpdate} from "./card-update";

export class CardUpdateRemove implements CardUpdate {

	newGroups: CardsGroup[];

	constructor(newGroups: CardsGroup[]) {
		this.newGroups = newGroups;
	}

	update(groups: CardsGroup[]): void {
		console.log('remove');
		const removedGroupIndex = groups.findIndex(group => group.id == this.newGroups[0].id);
		groups.splice(removedGroupIndex, 1);
	}

}
