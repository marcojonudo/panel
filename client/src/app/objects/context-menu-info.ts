import {CardsGroup} from "./cards-group";
import {Coordinates} from "./coordinates";

export class ContextMenuInfo {

	group: CardsGroup;
	coordinates: Coordinates;

	constructor(group: CardsGroup, coordinates: Coordinates) {
		this.group = group;
		this.coordinates = coordinates;
	}

}
