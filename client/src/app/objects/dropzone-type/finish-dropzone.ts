import {CardsGroup} from "../cards-group";
import {Constants} from "../constants";
import {Mechanic} from "../mechanic";
import {Dropzone} from "./dropzone";
import {CardPositionService} from "../../services/card-position.service";
import {CardsService} from "../../services/cards.service";
import {Coordinates} from "../coordinates";

export class FinishDropzone implements Dropzone {

	cardPositionService: CardPositionService;
	cardsService: CardsService;

	type: string = Constants.DROPZONE_TYPE.FINISH;
	mechanic: Mechanic;
	rect: any;

	constructor(
		cardPositionService: CardPositionService,
		cardsService: CardsService
	) {
		this.cardPositionService = cardPositionService;
		this.cardsService = cardsService;
	}

	validateMovement(position: Coordinates): CardsGroup[] {
		return [];
	}

	removeGroup(group: CardsGroup, validated: boolean): void {
		this.cardsService.removeFromFinished(group);
	}

	addGroup(
		groups: CardsGroup[],
		group: CardsGroup,
		position: Coordinates
	): Coordinates {
		this.cardsService.updateFinishedGroup(group);
		this.cardsService.addToFinished(group);
		this.cardPositionService.updateUnassignedGroupsLeft(this.cardsService.finishedCardsGroups);
		this.cardsService.notifyUnassigned();

		/* En el caso de fichas finalizadas no se devuelve posición, ya que no hay transición */
		return undefined;
	}

	handleNotValidatedMovement(group: CardsGroup): void {
		this.cardsService.addToFinished(group);
	}

}
