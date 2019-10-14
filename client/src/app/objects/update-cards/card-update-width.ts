import {CardsGroup} from "../cards-group";
import {CardUpdate} from "./card-update";

export class CardUpdateWidth implements CardUpdate {

	newGroups: CardsGroup[];

	constructor(newGroups: CardsGroup[]) {
		this.newGroups = newGroups;
	}

	/* En el caso de la modificación de ancho, no es necesario actualizar propiedades ya que se detecta el cambio
	*  llevado a cabo en CardsService al aplicar el CD */
	update(groups: CardsGroup[]): void {}

}
