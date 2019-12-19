import {CardsGroup} from "../cards-group";
import {CardPositionService} from "../../services/card-position.service";
import {CardsService} from "../../services/cards.service";
import {Coordinates} from "../coordinates";
import {Mechanic} from "../mechanic";
import {Constants} from "../constants";

export interface Dropzone {

	cardsService: CardsService;

	type: string;
	mechanic: Mechanic;
	rect: any;

	validateMovement(position: Coordinates): CardsGroup[];

	removeGroup(group: CardsGroup, validated: boolean, destinyDropzone: Dropzone): void;

	findLastPosition(groups: CardsGroup[], group: CardsGroup, position: Coordinates): Coordinates;

	addGroup(groups: CardsGroup[], group: CardsGroup, originDropzone: Dropzone, lastPosition: Coordinates): void;

	handleNotValidatedMovement(group: CardsGroup): void;

	updateAppointmentsCounterSubtract(group: CardsGroup, destinyDropzone: Dropzone): void;

	updateAppointmentsCounterAdd(group: CardsGroup, originDropzone: Dropzone): void;

}
