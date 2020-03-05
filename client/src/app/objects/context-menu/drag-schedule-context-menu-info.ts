import {Coordinates} from "../coordinates";
import {ContextMenuInfo} from "./context-menu-info";
import {Constants} from "../constants";

export class DragScheduleContextMenuInfo implements ContextMenuInfo {

	type: string;
	clickCoordinates: Coordinates;

	constructor(coordinates: Coordinates) {
		this.type = Constants.CONTEXT_MENU_TYPE.DRAG_SCHEDULE;
		this.clickCoordinates = coordinates;
	}

}
