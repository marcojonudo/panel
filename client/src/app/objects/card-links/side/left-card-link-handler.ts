import {SideCardLinkHandler} from "./side-card-link-handler";
import {Card} from "../../card";
import {CardsGroup} from "../../cards-group";

export class LeftCardLinkHandler implements SideCardLinkHandler {

	findAssignedGroup(groups: CardsGroup[], card: Card): CardsGroup {
		return groups.find((g: CardsGroup) => g.end.isSame(card.start));
	}

	findUnassignedGroup(groups: CardsGroup[], groupId: string): CardsGroup {
		const groupIndex = groups.findIndex((g: CardsGroup) => g.id == groupId);
		return groupIndex > -1 && groupIndex > 0 ? groups[groupIndex - 1] : undefined;
	}

	unlink(card: Card, group: CardsGroup): Card[] {
		card.linkedPrevious = undefined;
		const cardIndex = group.cards.findIndex((c: Card) => c.panelId == card.panelId);
		group.cards[cardIndex - 1].linkedNext = undefined;
		return group.cards.slice(cardIndex, group.cards.length);
	}

	link(group: CardsGroup, leftGroup: CardsGroup, card: Card): CardsGroup[] {
		const lastLeftGroupCardIndex = leftGroup.cards.length - 1;
		leftGroup.cards[lastLeftGroupCardIndex].linkedNext = card.clone();
		card.linkedPrevious = leftGroup.cards[lastLeftGroupCardIndex].clone();

		leftGroup.addCards(group.cards);
		return [leftGroup, group];
	}

}
