import {CardsGroup} from "../cards-group";
import {CardsService} from "../../services/cards.service";
import {Card} from "../card";

export interface CardLinkHandler {

	cardsService: CardsService;

	findGroups(card: Card): CardsGroup[];
	createGroup(cards: Card[], group: CardsGroup, cardIndex: number, offset: number): CardsGroup;
	updateGroupsAdd(newGroup: CardsGroup, index: number): void;
	updateGroupsRemove(newGroup: CardsGroup): void;

}
