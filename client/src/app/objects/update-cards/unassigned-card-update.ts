import {CardsGroup} from "../cards-group";

export interface UnassignedCardUpdate {

	type: string;
	newGroup: CardsGroup;

	update(groups: CardsGroup[]): void;

}
