import {CardsGroup} from "../cards-group";
import {Constants} from "../constants";
import {Mechanic} from "../mechanic";
import {Dropzone} from "./dropzone";
import {CardPositionService} from "../../services/card-position.service";
import {CardsService} from "../../services/cards.service";
import {Coordinates} from "../coordinates";
import {NotificationService} from "../../services/notification.service";
import {AppointmentsService} from "../../services/appointments.service";

export class FinishDropzone implements Dropzone {

	cardsService: CardsService;
	appointmentsService: AppointmentsService;

	type: string = Constants.DROPZONE_TYPE.FINISH;
	mechanic: Mechanic;
	rect: any;

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

	removeGroup(group: CardsGroup, validated: boolean): void {
		this.cardsService.removeFromFinished(group);
	}

	findLastPosition(): Coordinates {
		/* En el caso de fichas finalizadas no se devuelve posición, ya que no hay transición */
		return undefined;
	}

	addGroup(
		groups: CardsGroup[],
		group: CardsGroup,
		originDropzone: Dropzone
	): void {
		this.cardsService.updateFinishedGroup(group);
		this.updateAppointmentsCounterAdd(group, originDropzone);
		this.cardsService.addToFinished(group);
		CardPositionService.updateUnassignedGroupsLeft(this.cardsService.finishedCardsGroups);
		NotificationService.notifyBand();
	}

	handleNotValidatedMovement(group: CardsGroup): void {
		this.cardsService.addToFinished(group);
	}

	updateAppointmentsCounterSubtract(group: CardsGroup, destinyDropzone: Dropzone): void {}

	updateAppointmentsCounterAdd(group: CardsGroup, originDropzone: Dropzone): void {
		if (originDropzone.type == Constants.DROPZONE_TYPE.UNASSIGNED) {
			this.appointmentsService.updateAppointmentAdd(group.cards, group.cards[0].day)
		}
	}

}
