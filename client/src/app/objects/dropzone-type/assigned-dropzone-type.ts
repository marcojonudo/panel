import {CardsGroup} from "../cards-group";
import {Constants} from "../constants";
import {Mechanic} from "../mechanic";
import {DropzoneType} from "./dropzone-type";
import {CardPositionService} from "../../services/card-position.service";
import {CardsService} from "../../services/cards.service";
import {Coordinates} from "../coordinates";

export class AssignedDropzoneType implements DropzoneType {

	type: string = Constants.DROPZONE_TYPE.ASSIGNED;
	mechanic: Mechanic;

	constructor(mechanic: Mechanic) {
		this.mechanic = mechanic;
	}

	removeGroup(cardsService: CardsService, group: CardsGroup): void {
		cardsService.removeFromAssigned(group, this.mechanic.day, this.mechanic.code);
	}

	addGroup(
		cardPositionService: CardPositionService,
		cardsService: CardsService,
		group: CardsGroup,
		position: Coordinates
	): Coordinates {
		const lastPosition = cardPositionService.handleAssignedPosition(
			position,
			cardsService.getAssignedCardsGroups(this.mechanic.day, this.mechanic.code)
		);
		cardsService.updateAssignedCards(group, this.mechanic.day, this.mechanic.code);
		cardsService.addToAssigned(group, this.mechanic.day, this.mechanic.code);
		cardsService.updateAppointmentsPanel(group);
		return lastPosition;
	}

}
