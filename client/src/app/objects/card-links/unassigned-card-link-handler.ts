import {CardsGroup} from "../cards-group";
import {CardLinkHandler} from "./card-link-handler";
import {CardsService} from "../../services/cards.service";
import {Card} from "../card";

export class UnassignedCardLinkHandler implements CardLinkHandler {

	findGroups(card: Card): CardsGroup[] {
		return CardsService.findUnassignedGroups(card.type, card.status);
	}

	createGroup(cards: Card[]): CardsGroup {
		return new CardsGroup(cards);
	}

	updateGroupsAdd(newGroup: CardsGroup, index: number): void {
		CardsService.handleAddUnassignedCardsGroup(newGroup, index);
	}

	updateGroupsRemove(newGroup: CardsGroup): void {
		CardsService.handleRemoveUnassignedCardsGroup(newGroup);
	}

}
