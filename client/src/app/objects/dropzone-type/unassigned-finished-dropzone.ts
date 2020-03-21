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

export class UnassignedFinishedDropzone implements Dropzone {

	cardsService: CardsService;
	appointmentsService: AppointmentsService;

	type: string = Constants.DROPZONE_TYPE.UNASSIGNED_FINISHED;
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

	removeGroup(group: CardsGroup, validated: boolean, destinyDropzone: Dropzone): void {
		/* Si el movimiento se ha validado, es necesario ejectuar el CD para que se actualice la posición de los grupos
		*  no asignados. En caso contrario no, ya que la el grupo retornará a su posición original */
		this.updateAppointmentsCounterSubtract(group, destinyDropzone);
		CardsService.removeFromUnassigned(group, validated);
	}

	findLastCoordinates(groups: CardsGroup[], group): Coordinates {
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

	handleNotValidatedMovement(group: CardsGroup): void {
		setTimeout(
			() => CardsService.addToUnassigned(group),
			CardPositionService.getAddGroupDelay(group)
		);
	}

	updateAppointmentsCounterSubtract(group: CardsGroup, destinyDropzone: Dropzone): void {
		/* Si las fichas se están asignado (destinyDropzone = ASSIGNED) entre días, puede ser necesario restar del
		*  contador de citas del día de origen */
		if (destinyDropzone.type == Constants.DROPZONE_TYPE.ASSIGNED) {
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

	updateAppointmentsCounterAdd(group: CardsGroup, originDropzone: Dropzone): void {}

}
