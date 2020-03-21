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
import {ScheduleInterval} from "../schedule-interval";

export class FinishDropzone implements Dropzone {

	cardsService: CardsService;
	appointmentsService: AppointmentsService;

	type: string = Constants.DROPZONE_TYPE.FINISH;
	subType: string;
	mechanic: Mechanic;
	interval: ScheduleInterval;
	position: Position;

	constructor(
		cardsService: CardsService,
		appointmentsService: AppointmentsService
	) {
		this.cardsService = cardsService;
		this.appointmentsService = appointmentsService;
	}

	validateCoordinates(coordinates: Coordinates): Coordinates {
		return new Coordinates();
	}

	findGroupsToUpdate(group: CardsGroup, line: number): CardsGroup[] {
		return [];
	}

	removeGroup(group: CardsGroup, validated: boolean): void {}

	findLastCoordinates(groups: CardsGroup[], group: CardsGroup): Coordinates {
		/* En el caso de fichas finalizadas no se devuelve posición, ya que no hay transición */
		const sectionGroups = CardsService.findUnassignedGroups(group.type, Constants.CARD_STATUS.FINISHED);
		return CardPositionService.handleUnassignedPosition(group, sectionGroups);
	}

	addGroup(
		groups: CardsGroup[],
		group: CardsGroup,
		originDropzone: Dropzone
	): void {
		CardsService.updateFinishedGroup(group);
		this.cardsService.updateDbCardsPosition(group.cards);
		this.updateAppointmentsCounterAdd(group, originDropzone);
		CardsService.addToFinished(group);
		setTimeout(
			() => NotificationService.notifyBand(),
			CardPositionService.getAddGroupDelay(group)
		);
	}

	handleNotValidatedMovement(group: CardsGroup): void {
		CardsService.addToFinished(group);
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
