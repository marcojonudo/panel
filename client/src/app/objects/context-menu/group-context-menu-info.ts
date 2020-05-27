import {CardsGroup} from "../cards-group";
import {Coordinates} from "../coordinates";
import {ContextMenuInfo} from "./context-menu-info";
import {Constants} from "../constants";
import {NotificationService} from "../../services/notification.service";
import {CardsService} from "../../services/cards.service";

export class GroupContextMenuInfo implements ContextMenuInfo {

	type: string;
	group: CardsGroup;
	clickCoordinates: Coordinates;

	constructor(group: CardsGroup, coordinates: Coordinates) {
		this.type = Constants.CONTEXT_MENU_TYPE.GROUP;
		this.group = group;
		this.clickCoordinates = coordinates;
	}

	handleRemoval(): void {
		NotificationService.notifyContextMenu(undefined);
		CardsService.updateCardMode([this.group], Constants.GROUP_MODE.DRAG);
	}

}
