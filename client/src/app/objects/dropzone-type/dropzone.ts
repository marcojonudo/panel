import {CardsGroup} from "../cards-group";
import {CardPositionService} from "../../services/card-position.service";
import {CardsService} from "../../services/cards.service";
import {Coordinates} from "../coordinates";
import {Mechanic} from "../mechanic";
import {Position} from "../position";
import {ScheduleInterval} from "../schedule-interval";

export interface Dropzone {

	cardsService: CardsService;

	type: string;
	subType: string;
	mechanic: Mechanic;
	interval: ScheduleInterval;
	position: Position;

	validateCoordinates(coordinates: Coordinates): Coordinates;

	findGroupsToUpdate(group: CardsGroup, line: number): CardsGroup[];

	removeGroup(group: CardsGroup, validated: boolean, destinyDropzone: Dropzone): void;

	findLastCoordinates(groups: CardsGroup[], group: CardsGroup, position: Coordinates): Coordinates;

	addGroup(groups: CardsGroup[], group: CardsGroup, originDropzone: Dropzone, line: number): void;

	handleNotValidatedMovement(group: CardsGroup): void;

	updateAppointmentsCounterSubtract(group: CardsGroup, destinyDropzone: Dropzone): void;

	updateAppointmentsCounterAdd(group: CardsGroup, originDropzone: Dropzone): void;

}
