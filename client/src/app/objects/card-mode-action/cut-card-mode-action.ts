import {CardModeAction} from "./card-mode-action";
import {CardsService} from "../../services/cards.service";
import {CardsGroup} from "../cards-group";
import {CardPositionService} from "../../services/card-position.service";

export class CutCardModeAction implements CardModeAction {

	private cardsService: CardsService;

	constructor(cardsService: CardsService) {
		this.cardsService = cardsService;
	}

	execute(group: CardsGroup, x: number): void {
		let groupX;
		if (group.start) {
			x = CardPositionService.absolutePositionToLeft(x);
			groupX = group.left;
		} else {
			groupX = CardPositionService.barLeftToAbsolutePosition(group.left);
		}
		this.cardsService.cutCard(group, groupX, x);
	}

}
