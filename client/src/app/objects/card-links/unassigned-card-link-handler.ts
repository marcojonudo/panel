import {CardsGroup} from "../cards-group";
import {CardLinkHandler} from "./card-link-handler";
import {CardsService} from "../../services/cards.service";
import {Card} from "../card";
import {SideCardLinkHandler} from "./side/side-card-link-handler";

export class UnassignedCardLinkHandler implements CardLinkHandler {

	unassignedGroups: CardsGroup[];

	findGroups(card: Card, groups: CardsGroup[] = this.unassignedGroups): CardsGroup[] {
		return groups ? groups : CardsService.findUnassignedGroups(card.type, card.status);
	}

	findNextGroup(card: Card, sideLinkHandler: SideCardLinkHandler): CardsGroup {
		const unassignedGroups = this.findGroups(card);
		return sideLinkHandler.findUnassignedGroup(unassignedGroups, card.panelId);
	}

	unlink(card: Card, sideLinkHandler: SideCardLinkHandler): Card[] {
		const unassignedGroups = this.findGroups(card);
		const group = CardsService.findCardGroup(unassignedGroups, card.panelId);

		const newGroupCards = sideLinkHandler.unlink(card, group);
		const newGroup = new CardsGroup(newGroupCards);
		group.removeCards(0, group.cards.length - newGroupCards.length);

		/* El nuevo grupo se situá a la derecha del original, por lo que su índice será 1unidad superior */
		const newGroupIndex = unassignedGroups.findIndex((g: CardsGroup) => g.id == group.id) + 1;
		CardsService.handleAddUnassignedCardsGroup(newGroup, newGroupIndex, true);

		return [group.cards[group.cards.length - 1], newGroup.cards[0]]
	}

	link(card: Card, sideLinkHandler: SideCardLinkHandler): Card[] {
		const lineGroups = this.findGroups(card);
		const group = CardsService.findCardGroup(lineGroups, card.panelId);
		const nextGroup = sideLinkHandler.findUnassignedGroup(lineGroups, card.panelId);

		const groupCardsOriginalLength = group.cards.length;
		const [groupToUpdate, groupToRemove] = sideLinkHandler.link(group, nextGroup, card);
		CardsService.handleRemoveUnassignedCardsGroup(groupToRemove);
		return groupToUpdate.cards.slice(groupCardsOriginalLength - 1, groupCardsOriginalLength + 1);
	}

}
