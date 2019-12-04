import {CardsGroup} from "../cards-group";
import {CardPositionService} from "../../services/card-position.service";
import {CardsService} from "../../services/cards.service";
import {Coordinates} from "../coordinates";

export interface DropzoneType {

	type: string;

	removeGroup(cardsService: CardsService, group: CardsGroup);

	addGroup(
		cardPositionService: CardPositionService,
		cardsService: CardsService,
		group: CardsGroup,
		position: Coordinates
	): Coordinates;

}
