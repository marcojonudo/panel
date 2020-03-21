import {CardsGroup} from "../cards-group";
import {CardTypeBehaviour} from "./card-type-behaviour";
import {CardsService} from "../../services/cards.service";
import {NotificationService} from "../../services/notification.service";
import {WarningToast} from "../toasts/warning-toast";
import {Constants} from "../constants";
import {Coordinates} from "../coordinates";

export class AuxiliaryCardBehaviour implements CardTypeBehaviour {

	findHelperGroup(group: CardsGroup): CardsGroup {
		return group.start ? group : group.clone(true);
	}

	handleLeftClick(group: CardsGroup, x: number): void {
		CardsService.findCardModeAction(group.mode).execute(group, x);
	}

	handleRightClick(group: CardsGroup, coordinates: Coordinates): void {
		/* Obligatoriamente tiene que haber grupos no asignados para poder reemplazar una ficha temporal */
		if (CardsService.unassignedCardsGroups.length) {
			CardsService.auxiliaryGroupToReplace = group;
			CardsService.updateCardMode(CardsService.unassignedCardsGroups, Constants.GROUP_MODE.REPLACE);
		} else {
			NotificationService.notifyToast(new WarningToast(Constants.MESSAGE.NO_UNASSIGNED_GROUPS_TO_REPLACE));
		}
	}

}
