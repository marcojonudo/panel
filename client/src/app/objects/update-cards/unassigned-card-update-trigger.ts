import {CardsGroup} from "../cards-group";
import {UnassignedCardUpdate} from "./unassigned-card-update";

export class UnassignedCardUpdateTrigger implements UnassignedCardUpdate {

	type: string;
	newGroup: CardsGroup;

	constructor(newGroup: CardsGroup = undefined) {
		this.newGroup = newGroup;
		this.type = this.newGroup ? this.newGroup.type : undefined;
	}

	update(groups: CardsGroup[]): void {}

}
