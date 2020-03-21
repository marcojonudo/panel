import {CardsGroup} from "../cards-group";
import {Coordinates} from "../coordinates";

export interface CardTypeBehaviour {

	findHelperGroup(group: CardsGroup): CardsGroup;

	handleLeftClick(group: CardsGroup, x: number): void;

	handleRightClick(group: CardsGroup, coordinates: Coordinates): void;

}
