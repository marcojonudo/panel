import {CardModeAction} from "./card-mode-action";
import {CardsService} from "../../services/cards.service";
import {CardsGroup} from "../cards-group";
import {Constants} from "../constants";

export class ReplaceCardModeAction implements CardModeAction {

	private cardsService: CardsService;

	constructor(cardsService: CardsService) {
		this.cardsService = cardsService;
	}

	execute(group: CardsGroup, x: number): void {
		this.cardsService.replaceGroup(group);
		CardsService.updateCardMode(CardsService.unassignedCardsGroups.concat(group), Constants.GROUP_MODE.DRAG);
		CardsService.auxiliaryGroupToReplace = undefined;
	}

}
