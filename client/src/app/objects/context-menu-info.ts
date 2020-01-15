import {CardsGroup} from "./cards-group";
import {Coordinates} from "./coordinates";

export class ContextMenuInfo {

	group: CardsGroup;
	clickCoordinates: Coordinates;
	cardTop: number;

	constructor(group: CardsGroup, coordinates: Coordinates, cardTop: number) {
		this.group = group;
		this.clickCoordinates = coordinates;
		this.cardTop = cardTop;
	}

}
