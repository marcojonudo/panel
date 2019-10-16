import {CardsGroup} from "../cards-group";

export interface CardUpdate {

	newGroup: CardsGroup;

	update(groups: CardsGroup[]): void;

}
