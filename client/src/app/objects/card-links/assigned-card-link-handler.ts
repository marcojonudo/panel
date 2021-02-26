import {CardsGroup} from "../cards-group";
import {CardLinkHandler} from "./card-link-handler";
import {CardsService} from "../../services/cards.service";
import {Card} from "../card";
import {DimensionsService} from "../../services/dimensions.service";
import {NotificationService} from "../../services/notification.service";
import {SideCardLinkHandler} from "./side/side-card-link-handler";

export class AssignedCardLinkHandler implements CardLinkHandler {

	lineGroups: CardsGroup[];

	findGroups(card: Card, groups: CardsGroup[] = this.lineGroups): CardsGroup[] {
		return groups ? groups : CardsService.findLineGroups(card.day, card.mechanicCode, card.line);
	}

	findNextGroup(card: Card, sideLinkHandler: SideCardLinkHandler): CardsGroup {
		const lineGroups = this.findGroups(card);
		return sideLinkHandler.findAssignedGroup(lineGroups, card);
	}

	unlink(card: Card, sideLinkHandler: SideCardLinkHandler): Card[] {
		const lineGroups = this.findGroups(card);
		const group = CardsService.findCardGroup(lineGroups, card.panelId);

		const newGroupCards = sideLinkHandler.unlink(card, group);
		const newGroup = new CardsGroup(newGroupCards, DimensionsService.calcLeftFromStart(newGroupCards[0].start));

		/* Si  el grupo tiene 5 fichas, y las dos últimas se eliminan (pasan a formar parte de otro grupo), el original
		*  debe quedar con 3 (5 - 2) */
		group.removeCards(0, group.cards.length - newGroupCards.length);

		CardsService.handleAddAssignedGroup(card.day, card.mechanicCode, newGroup, true);

		return [group.cards[group.cards.length - 1], newGroup.cards[0]];
	}

	link(card: Card, sideLinkHandler: SideCardLinkHandler): Card[] {
		const lineGroups = this.findGroups(card);
		const group = CardsService.findCardGroup(lineGroups, card.panelId);
		const nextGroup = sideLinkHandler.findAssignedGroup(lineGroups, card);

		const [groupToUpdate, groupToRemove] = sideLinkHandler.link(group, nextGroup, card);
		CardsService.handleRemoveAssignedGroup(card.day, card.mechanicCode, groupToRemove);

		/* Cuando se agrupan dos grupos y sólo queda 1 para toda la orden, se deshabilita el highlight (un grupo por
		*  orden no debe mostrar el resaltado). Por tanto, al estar activado al haber pasado el cursor por una de las
		*  fichas, es necesario desactivarlo para que no quede permanentemente activado */
		groupToUpdate.highlight = false;
		NotificationService.notifyGroups([groupToUpdate], true);

		return sideLinkHandler.findLinkedCards(
			groupToUpdate, groupToUpdate.cards.findIndex((c: Card) => c.panelId == card.panelId)
		);
	}

}
