import {SideCardLinkHandler} from "./side-card-link-handler";
import {Card} from "../../card";
import {CardsGroup} from "../../cards-group";

export class RightCardLinkHandler implements SideCardLinkHandler {

	findAssignedGroup(groups: CardsGroup[], card: Card): CardsGroup {
		return groups.find((g: CardsGroup) => g.start.isSame(card.end));
	}

	findUnassignedGroup(groups: CardsGroup[], cardId: string): CardsGroup {
		const groupIndex = groups.findIndex((g: CardsGroup) =>
			g.cards.find((c: Card) => c.panelId == cardId) != undefined
		);
		return groupIndex > -1 && groupIndex < groups.length - 1 ? groups[groupIndex + 1] : undefined;
	}

	unlink(card: Card, group: CardsGroup): Card[] {
		card.linkedNext = undefined;
		const cardIndex = group.cards.findIndex((c: Card) => c.panelId == card.panelId);
		group.cards[cardIndex + 1].linkedPrevious = undefined;
		return group.cards.slice(cardIndex + 1, group.cards.length);
	}

	link(group: CardsGroup, rightGroup: CardsGroup, card: Card): CardsGroup[] {
		card.linkedNext = rightGroup.cards[0].clone();
		rightGroup.cards[0].linkedPrevious = card.clone();
		group.addCards(rightGroup.cards);
		return [group, rightGroup];
	}

	findLinkedCards(group: CardsGroup, cardIndex: number): Card[] {
		return group.cards.slice(cardIndex, cardIndex + 2);
	}

}
