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

export class UnassignedDropzone implements Dropzone {

	cardsService: CardsService;
	appointmentsService: AppointmentsService;

	type: string = Constants.DROPZONE_TYPE.UNASSIGNED;
	subType: string;
	mechanic: Mechanic;
	rect: any;

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
		/* Si el destino es la cita, no hace falta validar ya que siempre es un movimiento válido. Por tanto, se
		*  devuelve una lista vacía en lugar de undefined */
		return [];
	}

	removeGroup(group: CardsGroup, validated: boolean, destinyDropzone: Dropzone): void {
		/* Si el movimiento se ha validado, es necesario ejectuar el CD para que se actualice la posición de los grupos
		*  no asignados. En caso contrario no, ya que la el grupo retornará a su posición original */
		this.updateAppointmentsCounterSubtract(group, destinyDropzone);
		this.cardsService.removeFromUnassigned(group, validated);
	}

	findLastPosition(groups: CardsGroup[], group): Coordinates {
		return CardPositionService.handleUnassignedPosition(group, this.cardsService.unassignedTypesCardsGroups);
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
			Constants.VALUE.CARD_MOVEMENT_DURATION
		);
	}

	handleNotValidatedMovement(group: CardsGroup): void {
		setTimeout(
			() => this.cardsService.addToUnassigned(group),
			Constants.VALUE.CARD_MOVEMENT_DURATION
		);
	}

	updateAppointmentsCounterSubtract(group: CardsGroup, destinyDropzone: Dropzone): void {
		/* Si las fichas se están asignado (destinyDropzone = ASSIGNED) entre días, puede ser necesario restar del
		*  contador de citas del día de origen */
		if (destinyDropzone.type == Constants.DROPZONE_TYPE.ASSIGNED) {
			/* Si la ficha no está finalizada, significa que se está asignando por primera vez. En este caso, el día de
			*  origen es el de la orden, y sólo es necesario actualizar el total (al no estar asignada, sólo contaba
			*  para el total, no para morngin o afternoon */
			if (this.subType != Constants.DROPZONE_TYPE.FINISH) {
				const originDay = group.cards[0].order.day;
				this.appointmentsService.updateAppointment(
					originDay,
					group.cards,
					false,
					new UpdateAppointmentDayParams(false, false)
				)
			} else {
				/* Si la ficha estaba finalizada, se debe actualizar la info del último día en el que estuvo asignada
				*  (tanto morning o afternoon, como total, ya que en este caso sí se había contado la ficha según el
				*  tipo de horario */
				const originDay = group.cards[0].lastDay;
				this.appointmentsService.updateAppointment(
					originDay,
					group.cards,
					false,
					new UpdateAppointmentDayParams(true, true)
				)
			}
		}
	}

	updateAppointmentsCounterAdd(group: CardsGroup, originDropzone: Dropzone): void {}

}
