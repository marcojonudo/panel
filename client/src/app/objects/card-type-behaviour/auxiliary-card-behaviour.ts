import {CardsGroup} from "../cards-group";
import {CardTypeBehaviour} from "./card-type-behaviour";
import {CardsService} from "../../services/cards.service";
import {NotificationService} from "../../services/notification.service";
import {Coordinates} from "../coordinates";
import {GroupContextMenuInfo} from "../context-menu/group-context-menu-info";

export class AuxiliaryCardBehaviour implements CardTypeBehaviour {

	findHelperGroup(group: CardsGroup): CardsGroup {
		return group.start ? group : group.clone(true);
	}

	handleLeftClick(group: CardsGroup, x: number): void {
		CardsService.findCardModeAction(group.mode).execute(group, x);
	}

	handleRightClick(group: CardsGroup, coordinates: Coordinates): void {
		/* Sólo se permite modificar la ficha si ya está asignada. Las plantillas de auxiliares deben permanecer
		*  siempre igual */
		if (group.day) {
			NotificationService.notifyContextMenu(new GroupContextMenuInfo(group, coordinates), true);
		}
	}

}
