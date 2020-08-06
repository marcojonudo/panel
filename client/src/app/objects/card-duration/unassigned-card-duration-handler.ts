import {CardsGroup} from "../cards-group";
import {CardsService} from "../../services/cards.service";
import {Card} from "../card";
import {DimensionsService} from "../../services/dimensions.service";
import {CardDurationHandler} from "./card-duration-handler";
import {NotificationService} from "../../services/notification.service";
import {Mechanic} from "../mechanic";
import {UpdateDurationInfo} from "./update-duration-info";

export class UnassignedCardDurationHandler implements CardDurationHandler {

	groups: CardsGroup[];

	findGroups(card: Card): CardsGroup[] {
		this.groups = CardsService.findUnassignedGroups(card.type, card.status);
		return this.groups;
	}

	updateDuration(card: Card, group: CardsGroup, durationIncrease: number, widthIncrease: number): UpdateDurationInfo {
		/* En grupos no asignados, al actualizar la duración se deben desplazar todos los grupos de la cinta que estén
		*  a su derecha */
		const groupIndex = this.groups.findIndex((g: CardsGroup) => g.id == group.id);
		const updatedGroups = this.groups.slice(groupIndex+1, this.groups.length+1);
		this.updateNextGroupsPosition(updatedGroups, widthIncrease);

		card.setDuration(card.duration + durationIncrease, card.width + widthIncrease);
		NotificationService.notifyBand(undefined, [group]);
		return new UpdateDurationInfo(group.cards, false);
	}

	updateNextGroupsPosition(groups: CardsGroup[], widthStep: number): Card[] {
		const cards = []
		groups.forEach(group => {
			group.left += widthStep;
			cards.push(...group.cards);
		});
		return cards;
	}

	validateDurationUpdate(group: CardsGroup, card: Card, mechanic: Mechanic): CardsGroup[] {
		return [];
	}

}
