import {CardModeAction} from "./card-mode-action";
import {CardsService} from "../../services/cards.service";
import {CardsGroup} from "../cards-group";
import {Constants} from "../constants";
import {CardPositionService} from "../../services/card-position.service";

export class CutCardModeAction implements CardModeAction {

	execute: (group: CardsGroup, x: number) => void;

	constructor(cardsService: CardsService) {
		this.execute = (group: CardsGroup, x: number) => {
			let groupX = undefined;
			if (group.start) {
				x = CardPositionService.absolutePositionToLeft(x);
				groupX = group.left;
			} else {
				groupX = CardPositionService.barLeftToAbsolutePosition(group.left);
			}
			cardsService.cutCard(group, groupX, x);
			cardsService.updateCardMode([group], Constants.GROUP_MODE.DRAG);
		}
	}

}
