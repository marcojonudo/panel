import {CardsGroup} from "../cards-group";
import {UnassignedCardUpdate} from "./unassigned-card-update";
import {Constants} from "../constants";

export class UnassignedCardUpdateTrigger implements UnassignedCardUpdate {

	type: string;
	newGroup: CardsGroup;

	constructor(newGroup: CardsGroup = undefined, type: string = undefined) {
		this.newGroup = newGroup;
		this.type = type
			? type
			: this.newGroup
				? newGroup.status == Constants.CARD_STATUS.FINISHED ? Constants.CARD_STATUS.FINISHED : this.newGroup.type
				: undefined;
	}

	update(groups: CardsGroup[]): void {}

}
