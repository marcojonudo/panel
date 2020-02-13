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

export class AuxiliaryDropzone implements Dropzone {

	cardsService: CardsService;
	appointmentsService: AppointmentsService;

	type: string = Constants.DROPZONE_TYPE.AUXILIARY;
	subType: string;
	mechanic: Mechanic;
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

	validateMovement(): CardsGroup[] {
		/* Si el destino es la cinta, no hace falta validar ya que siempre es un movimiento válido. Por tanto, se
		*  devuelve una lista vacía en lugar de undefined */
		return [];
	}

	removeGroup(group: CardsGroup, validated: boolean, destinyDropzone: Dropzone): void {}

	findLastPosition(groups: CardsGroup[], group: CardsGroup): Coordinates {
		const sectionGroups = this.cardsService.findUnassignedGroups(group.type, group.status);
		return CardPositionService.handleUnassignedPosition(group, sectionGroups);
	}

	addGroup(
		groups: CardsGroup[],
		group: CardsGroup
	): void {
		this.cardsService.resetCardsGroup(group);
		this.cardsService.addToUnassigned(group);

		/* Terminada la transición, se ejecuta el CD para que se elimine el hidden del grupo añadido */
		setTimeout(
			() => NotificationService.notifyBand(),
			CardPositionService.getAddGroupDelay()
		);
	}

	handleNotValidatedMovement(group: CardsGroup): void {
		setTimeout(
			() => this.cardsService.addToUnassigned(group),
			CardPositionService.getAddGroupDelay()
		);
	}

	updateAppointmentsCounterSubtract(group: CardsGroup, destinyDropzone: Dropzone): void {}

	updateAppointmentsCounterAdd(group: CardsGroup, originDropzone: Dropzone): void {}

}
