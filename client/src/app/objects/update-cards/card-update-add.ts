import {CardsGroup} from "../cards-group";
import {CardUpdate} from "./card-update";

export class CardUpdateAdd implements CardUpdate {

	newGroup: CardsGroup;

	constructor(newGroup: CardsGroup) {
		this.newGroup = newGroup;
	}

	update(groups: CardsGroup[]): void {
		/* Al añadir un nuevo grupo, siempre se hace de uno en uno (no se puede arrastrar más de un grupo por panel */
		groups.push(this.newGroup);
	}

}
