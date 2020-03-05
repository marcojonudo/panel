import {CardsGroup} from "../cards-group";
import {Coordinates} from "../coordinates";
import {ContextMenuInfo} from "./context-menu-info";
import {Constants} from "../constants";

export class GroupContextMenuInfo implements ContextMenuInfo {

	type: string;
	group: CardsGroup;
	clickCoordinates: Coordinates;

	constructor(group: CardsGroup, coordinates: Coordinates) {
		this.type = Constants.CONTEXT_MENU_TYPE.GROUP;
		this.group = group;
		this.clickCoordinates = coordinates;
	}

}
