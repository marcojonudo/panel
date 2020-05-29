import {Coordinates} from "../coordinates";
import {ContextMenuInfo} from "./context-menu-info";
import {Constants} from "../constants";
import {NotificationService} from "../../services/notification.service";
import {CardsService} from "../../services/cards.service";
import {ContextMenuElement} from "./menu-elements/context-menu-element";

export class DragScheduleContextMenuInfo implements ContextMenuInfo {

	type: string;
	clickCoordinates: Coordinates;

	constructor(coordinates: Coordinates) {
		this.type = Constants.CONTEXT_MENU_TYPE.DRAG_SCHEDULE;
		this.clickCoordinates = coordinates;
	}

	findTop(y: number = this.clickCoordinates.y): number {
		return y;
	}

	findBottom(y: number = this.clickCoordinates.y): number {
		return undefined;
	}

	handleRemoval(): void {
		NotificationService.notifyContextMenu(undefined);
	}

}
