import {CardsGroup} from "../cards-group";
import {UnassignedCardUpdate} from "../update-cards/unassigned-card-update";
import {DayCardUpdate} from "./day-card-update";

export class DayCardUpdateTrigger implements DayCardUpdate {

	day: Date;
	mechanicCode: string;
	newGroup: CardsGroup;

	/* No es necesario actualizar propiedades ya que se detecta el cambio
	*  llevado a cabo en CardsService al aplicar el CD */
	update(groups: CardsGroup[]): void {}

}
