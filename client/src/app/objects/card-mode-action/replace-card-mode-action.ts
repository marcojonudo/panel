import {CardModeAction} from "./card-mode-action";
import {CardsService} from "../../services/cards.service";
import {CardsGroup} from "../cards-group";
import {Constants} from "../constants";
import {CardPositionService} from "../../services/card-position.service";

export class ReplaceCardModeAction implements CardModeAction {

	execute: (group: CardsGroup, x: number) => void;

	constructor(cardsService: CardsService) {
		this.execute = (group: CardsGroup) => {
			cardsService.replaceGroup(group);
			cardsService.updateCardMode(cardsService.unassignedCardsGroups.concat(group), Constants.GROUP_MODE.DRAG);
		}
	}

}
