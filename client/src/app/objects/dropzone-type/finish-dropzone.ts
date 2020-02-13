import {CardsGroup} from "../cards-group";
import {Constants} from "../constants";
import {Mechanic} from "../mechanic";
import {Dropzone} from "./dropzone";
import {CardPositionService} from "../../services/card-position.service";
import {CardsService} from "../../services/cards.service";
import {Coordinates} from "../coordinates";
import {NotificationService} from "../../services/notification.service";
import {AppointmentsService} from "../../services/appointments.service";
import {UpdateAppointmentDayParams} from "../update-appointment-day-params";
import {Position} from "../position";

export class FinishDropzone implements Dropzone {

	cardsService: CardsService;
	appointmentsService: AppointmentsService;

	type: string = Constants.DROPZONE_TYPE.FINISH;
	subType: string;
	mechanic: Mechanic;
	position: Position;

	constructor(
		cardsService: CardsService,
		appointmentsService: AppointmentsService
	) {
		this.cardsService = cardsService;
		this.appointmentsService = appointmentsService;
	}

	validateMovement(position: Coordinates): CardsGroup[] {
		return [];
	}

	removeGroup(group: CardsGroup, validated: boolean): void {}

	findLastPosition(groups: CardsGroup[], group: CardsGroup): Coordinates {
		/* En el caso de fichas finalizadas no se devuelve posición, ya que no hay transición */
		const sectionGroups = this.cardsService.findUnassignedGroups(group.type, Constants.CARD_STATUS.FINISHED);
		return CardPositionService.handleUnassignedPosition(group, sectionGroups);
	}

	addGroup(
		groups: CardsGroup[],
		group: CardsGroup,
		originDropzone: Dropzone
	): void {
		this.cardsService.updateFinishedGroup(group);
		this.updateAppointmentsCounterAdd(group, originDropzone);
		this.cardsService.addToFinished(group);
		setTimeout(
			() => NotificationService.notifyBand(),
			CardPositionService.getAddGroupDelay()
		);
	}

	handleNotValidatedMovement(group: CardsGroup): void {
		this.cardsService.addToFinished(group);
	}

	updateAppointmentsCounterSubtract(group: CardsGroup, destinyDropzone: Dropzone): void {}

	updateAppointmentsCounterAdd(group: CardsGroup, originDropzone: Dropzone): void {
		if (originDropzone.type == Constants.DROPZONE_TYPE.UNASSIGNED) {
			// this.appointmentsService.updateAppointment(group.cards,true, true);
			this.appointmentsService.updateAppointment(
				group.cards[0].day,
				group.cards,
				true,
				new UpdateAppointmentDayParams(false, true),
				true
			)
		}
	}

}
