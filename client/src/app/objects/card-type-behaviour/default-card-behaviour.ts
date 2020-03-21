import {CardsGroup} from "../cards-group";
import {CardTypeBehaviour} from "./card-type-behaviour";
import {NotificationService} from "../../services/notification.service";
import {Coordinates} from "../coordinates";
import {CardsService} from "../../services/cards.service";
import {GroupContextMenuInfo} from "../context-menu/group-context-menu-info";

export class DefaultCardBehaviour implements CardTypeBehaviour {

	findHelperGroup(group: CardsGroup): CardsGroup {
		return group;
	}

	handleLeftClick(group: CardsGroup, x: number): void {
		CardsService.findCardModeAction(group.mode).execute(group, x);
	}

	handleRightClick(group: CardsGroup, coordinates: Coordinates): void {
		NotificationService.notifyContextMenu(new GroupContextMenuInfo(group, coordinates));
	}

}
