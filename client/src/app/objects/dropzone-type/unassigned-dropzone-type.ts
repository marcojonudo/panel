import {CardsGroup} from "../cards-group";
import {Constants} from "../constants";
import {Mechanic} from "../mechanic";
import {DropzoneType} from "./dropzone-type";
import {CardPositionService} from "../../services/card-position.service";
import {CardsService} from "../../services/cards.service";
import {Coordinates} from "../coordinates";

export class UnassignedDropzoneType implements DropzoneType {

	type: string = Constants.DROPZONE_TYPE.UNASSIGNED;

	removeGroup(cardsService: CardsService, group: CardsGroup): void {
		cardsService.removeFromUnassigned(group);
	}

	addGroup(
		cardPositionService: CardPositionService,
		cardsService: CardsService,
		group: CardsGroup,
		position: Coordinates
	): Coordinates {
		cardsService.resetCardsGroup(group);
		cardsService.addToUnassigned(group);
		const newPosition = cardPositionService.handleUnassignedPosition(group);
		cardsService.notifyUnassigned();
		return newPosition;
	}

}
