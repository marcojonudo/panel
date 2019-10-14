import {CardsGroup} from "../cards-group";
import {CardUpdate} from "./card-update";

export class CardUpdateAdd implements CardUpdate {

	newGroups: CardsGroup[];

	constructor(newGroups: CardsGroup[]) {
		this.newGroups = newGroups;
	}

	update(groups: CardsGroup[]): void {
		console.log('update');
		/* Al añadir un nuevo grupo, siempre se hace de uno en uno (no se puede arrastrar más de un grupo por panel */
		groups.push(this.newGroups[0]);
	}

}
