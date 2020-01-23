import {CardsGroup} from "../cards-group";
import {CardLinkHandler} from "./card-link-handler";
import {CardsService} from "../../services/cards.service";
import {Card} from "../card";

export class UnassignedCardLinkHandler implements CardLinkHandler {

	cardsService: CardsService;

	constructor(cardsService: CardsService) {
		this.cardsService = cardsService;
	}

	findGroups(card: Card): CardsGroup[] {
		return this.cardsService.findUnassignedGroups(card.type, card.status);
	}

	createGroup(cards: Card[]): CardsGroup {
		return new CardsGroup(cards);
	}

	updateGroupsAdd(newGroup: CardsGroup, index: number): void {
		this.cardsService.handleAddUnassignedCardsGroup(newGroup, index);
	}

	updateGroupsRemove(newGroup: CardsGroup): void {
		this.cardsService.handleRemoveUnassignedCardsGroup(newGroup);
	}

}
