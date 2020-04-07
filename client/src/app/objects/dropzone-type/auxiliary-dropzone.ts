import {CardsGroup} from "../cards-group";
import {Constants} from "../constants";
import {Mechanic} from "../mechanic";
import {Dropzone} from "./dropzone";
import {CardPositionService} from "../../services/card-position.service";
import {CardsService} from "../../services/cards.service";
import {Coordinates} from "../coordinates";
import {NotificationService} from "../../services/notification.service";
import {AppointmentsService} from "../../services/appointments.service";
import {Position} from "../position";
import {ScheduleInterval} from "../schedule-interval";

export class AuxiliaryDropzone implements Dropzone {

	cardsService: CardsService;
	appointmentsService: AppointmentsService;

	type: string = Constants.DROPZONE_TYPE.AUXILIARY;
	subType: string;
	mechanic: Mechanic;
	interval: ScheduleInterval;
	position: Position;

	constructor(
		cardsService: CardsService,
		appointmentsService: AppointmentsService,
		subType: string
	) {
		this.cardsService = cardsService;
		this.appointmentsService = appointmentsService;
		this.subType = subType;
	}

	validateCoordinates(coordinates: Coordinates): Coordinates {
		return new Coordinates();
	}

	findGroupsToUpdate(group: CardsGroup, line: number): CardsGroup[] {
		return [];
	}

	removeGroup(group: CardsGroup, validated: boolean, destinyDropzone: Dropzone): void {}

	findLastCoordinates(groups: CardsGroup[], group: CardsGroup): Coordinates {
		const sectionGroups = CardsService.findUnassignedGroups(group.type, group.status);
		return CardPositionService.handleUnassignedPosition(group, sectionGroups);
	}

	addGroup(
		groups: CardsGroup[],
		group: CardsGroup
	): void {
		CardsService.resetCardsGroup(group);
		this.cardsService.updateDbCardsPosition(group.cards);
		CardsService.addToUnassigned(group);

		/* Terminada la transición, se ejecuta el CD para que se elimine el hidden del grupo añadido */
		setTimeout(
			() => NotificationService.notifyBand(),
			CardPositionService.getAddGroupDelay(group)
		);
	}

	handleNotValidatedMovement(group: CardsGroup): void {}

	updateAppointmentsCounterSubtract(group: CardsGroup, destinyDropzone: Dropzone): void {}

	updateAppointmentsCounterAdd(group: CardsGroup, originDropzone: Dropzone): void {}

}
