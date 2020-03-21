import {CardsGroup} from "../cards-group";

export interface CardModeAction {

	execute(group: CardsGroup, x: number): void;

}
