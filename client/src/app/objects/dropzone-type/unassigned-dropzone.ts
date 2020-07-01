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
import * as dayjs from "dayjs";
import {OverlappedGroupsInfo} from "../groups-translation/overlapped-groups-info";
import {Dayjs} from "dayjs";

export class UnassignedDropzone implements Dropzone {

	cardsService: CardsService;
	appointmentsService: AppointmentsService;

	type: string = Constants.DROPZONE_TYPE.UNASSIGNED;
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

	validate(coordinates: Coordinates, group: CardsGroup): OverlappedGroupsInfo {
		return new OverlappedGroupsInfo();
	}

	removeGroup(group: CardsGroup, destinyDropzone: Dropzone): void {
		CardsService.removeFromUnassigned(group);

		/* Si las fichas se están asignado (destinyDropzone = ASSIGNED) entre días, puede ser necesario restar del
		*  contador de citas del día de origen */
		if (destinyDropzone.type == Constants.DROPZONE_TYPE.ASSIGNED) {
			this.updateAppointmentsCounterSubtract(group, destinyDropzone);
		}

			// if (validated) {
		// TODO Revisar
		// this.updateAppointmentsCounterSubtract(group, destinyDropzone);
		// }
	}

	updateProperties(groups: CardsGroup[], newStart: Dayjs, line: number, mechanic: Mechanic): void {
		CardsService.resetCardsGroup(groups[0]);
	}

	addGroup(groups: CardsGroup[], group: CardsGroup): void {
		this.cardsService.updateDbCardsPosition(group.cards);
		CardsService.addToUnassigned(group);

		/* Terminada la transición, se ejecuta el CD para que se elimine el hidden del grupo añadido */
		setTimeout(
			() => NotificationService.notifyBand(),
			CardPositionService.getAddGroupDelay(group)
		);
	}

	findLastCoordinates(group: CardsGroup, coordinates: Coordinates): Coordinates {
		return new Coordinates(group.left, CardPositionService.unassignedCardTop);
	}

	handleNotValidatedMovement(group: CardsGroup): void {
		setTimeout(
			() => NotificationService.notifyBand(undefined, [group]),
			CardPositionService.getAddGroupDelay(group)
		);
	}

	updateAppointmentsCounterSubtract(group: CardsGroup, destinyDropzone: Dropzone): void {
		// /* Si la ficha no está finalizada, significa que se está asignando por primera vez. En este caso, el día de
		// *  origen es el de la orden, y sólo es necesario actualizar el total (al no estar asignada, sólo contaba
		// *  para el total, no para morning o afternoon */
		// const originDay = group.cards[0].order.day;
		// /* El día de la orden podría haber pasado. De ser así, no se actualiza nada del contador de citas, ya que
		// *  directamente no hay panel para días anteriores a hoy */
		// if (originDay >= dayjs().startOf(Constants.DAY_JS.d)) {
		// 	this.appointmentsService.updateAppointment(
		// 		originDay,
		// 		group.cards,
		// 		false,
		// 		false
		// 	)
		// }
	}

	updateAppointmentsCounterAdd(group: CardsGroup, originDropzone: Dropzone): void {}

}
