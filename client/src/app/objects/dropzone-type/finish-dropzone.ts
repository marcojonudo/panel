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
import {Dayjs} from "dayjs";
import {OverlappedGroupsInfo} from "../groups-translation/overlapped-groups-info";
import {Card} from "../card";

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

	validate(coordinates: Coordinates, group: CardsGroup): OverlappedGroupsInfo {
		return new OverlappedGroupsInfo();
	}

	removeGroup(group: CardsGroup): void {}

	updateProperties(groups: CardsGroup[], newStart: Dayjs, line: number, mechanic: Mechanic): void {
		CardsService.updateFinishedGroup(groups[0]);
	}

	addGroup(groups: CardsGroup[], group: CardsGroup, originDropzone: Dropzone): void {
		this.cardsService.updateDbCardsPosition(group.cards);
		this.updateAppointmentsCounterAdd(group, originDropzone);
		CardsService.addToFinished(group);
		CardPositionService.setHelperGroup(undefined);
	}

	findLastCoordinates(group: CardsGroup, coordinates: Coordinates): Coordinates {
		return coordinates;
	}

	handleNotValidatedMovement(group: CardsGroup): void {}

	updateAppointmentsCounterSubtract(group: CardsGroup, destinyDropzone: Dropzone): void {}

	updateAppointmentsCounterAdd(group: CardsGroup, originDropzone: Dropzone): void {
		// // TODO Revsiar si en este caso hay que añadir una
		// if (originDropzone.type == Constants.DROPZONE_TYPE.UNASSIGNED) {
		// 	this.appointmentsService.updateAppointment(
		// 		group.cards[0].day,
		// 		group.cards,
		// 		true,
		// 		false,
		// 		true
		// 	)
		// }
	}

}
