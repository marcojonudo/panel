import {CardsGroup} from "../cards-group";

export interface CardUpdate {

	newGroups: CardsGroup[];

	// update(): void;
	update(groups: CardsGroup[]): void;
	// update(groups: CardsGroup[], newGroups: CardsGroup[]): void;

}
