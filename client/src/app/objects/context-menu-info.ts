import {CardsGroup} from "./cards-group";
import {Coordinates} from "./coordinates";

export class ContextMenuInfo {

	group: CardsGroup;
	clickCoordinates: Coordinates;

	constructor(group: CardsGroup, coordinates: Coordinates) {
		this.group = group;
		this.clickCoordinates = coordinates;
	}

}
