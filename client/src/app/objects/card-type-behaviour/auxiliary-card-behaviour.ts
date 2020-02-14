import {CardsGroup} from "../cards-group";
import {CardTypeBehaviour} from "./card-type-behaviour";
import {CardsService} from "../../services/cards.service";
import {NotificationService} from "../../services/notification.service";
import {WarningToast} from "../toasts/warning-toast";
import {Constants} from "../constants";

export class AuxiliaryCardBehaviour implements CardTypeBehaviour {

	findHelperGroup: Function;
	handleLeftClick: Function;
	handleRightClick: Function;

	constructor(cardsService: CardsService) {
		this.findHelperGroup = (group) => group.start ? group : group.clone(true);
		this.handleLeftClick = (group: CardsGroup, x: number) =>
			cardsService.findCardModeAction(group.mode).execute(group, x);
		this.handleRightClick = (group: CardsGroup) => {
			/* Obligatoriamente tiene que haber grupos no asignados para poder reemplazar una ficha temporal */
			if (cardsService.unassignedCardsGroups.length) {
				CardsService.auxiliaryGroupToReplace = group;
				cardsService.updateCardMode(cardsService.unassignedCardsGroups, Constants.GROUP_MODE.REPLACE);
			} else {
				NotificationService.notifyToast(new WarningToast(Constants.MESSAGE.NO_UNASSIGNED_GROUPS_TO_REPLACE));
			}
		}
	}

}
