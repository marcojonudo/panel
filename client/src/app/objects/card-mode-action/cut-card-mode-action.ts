import {CardModeAction} from "./card-mode-action";
import {CardsService} from "../../services/cards.service";
import {CardsGroup} from "../cards-group";
import {Constants} from "../constants";

export class CutCardModeAction implements CardModeAction {

	execute: (group: CardsGroup, x: number) => void;

	constructor(cardsService: CardsService) {
		this.execute = (group: CardsGroup, x: number) => {
			cardsService.cutCard(group, x);
			cardsService.updateCardMode(group, Constants.GROUP_MODE.DRAG);
		}
	}

}
