import {CardsGroup} from "../cards-group";
import {CardLinkHandler} from "./card-link-handler";
import {CardsService} from "../../services/cards.service";
import {Card} from "../card";
import {DimensionsService} from "../../services/dimensions.service";

export class AssignedCardLinkHandler implements CardLinkHandler {

	cardsService: CardsService;

	constructor(cardsService: CardsService) {
		this.cardsService = cardsService;
	}

	findGroups(card: Card): CardsGroup[] {
		return this.cardsService.findLineGroups(card.day, card.mechanicCode, card.line);
	}

	createGroup(cards: Card[], group: CardsGroup, cardIndex: number, offset: number): CardsGroup {
		return new CardsGroup(cards, DimensionsService.calcLeftFromStart(group.cards[0].start));
	}

	updateGroupsAdd(newGroup: CardsGroup): void {
		this.cardsService.handleAddAssignedCardsGroup(newGroup.cards[0].day, newGroup.cards[0].mechanicCode, newGroup);
	}

	updateGroupsRemove(newGroup: CardsGroup): void {
		this.cardsService.handleRemoveAssignedCardsGroup(newGroup.cards[0].day, newGroup.cards[0].mechanicCode, newGroup);
	}

}
