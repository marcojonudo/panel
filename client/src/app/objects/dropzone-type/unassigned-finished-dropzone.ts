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
import {OverlappedGroupsInfo} from "../groups-translation/overlapped-groups-info";
import {Dayjs} from "dayjs";

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

	validate(coordinates: Coordinates, group: CardsGroup): OverlappedGroupsInfo {
		return new OverlappedGroupsInfo();
	}

	removeGroup(group: CardsGroup, destinyDropzone: Dropzone): void {
		/* Si las fichas se están asignado (destinyDropzone = ASSIGNED) entre días, puede ser necesario restar del
		*  contador de citas del día de origen */
		if (destinyDropzone.type == Constants.DROPZONE_TYPE.ASSIGNED) {
			this.updateAppointmentsCounterSubtract(group, destinyDropzone);
		}
		CardsService.removeFromUnassigned(group);
	}

	updateProperties(groups: CardsGroup[], newStart: Dayjs, line: number, mechanic: Mechanic): void {
		CardsService.resetCardsGroup(groups[0]);
	}

	addGroup(
		groups: CardsGroup[],
		group: CardsGroup
	): void {
		this.cardsService.updateDbCardsPosition(group.cards);
		CardsService.addToUnassigned(group);

		/* Se notifica el helper group para que desaparezca del overlay. No hace falta notificar a la cinta, ya que se
		*  actualizará su contenido cuando se salga de la zona de finalizadas */
		CardPositionService.setHelperGroup(undefined);
	}

	findLastCoordinates(group: CardsGroup, coordinates: Coordinates): Coordinates {
		return new Coordinates(group.left, CardPositionService.unassignedCardTop);
	}

	handleNotValidatedMovement(group: CardsGroup): void {
		setTimeout(
			() => CardsService.addToUnassigned(group),
			CardPositionService.getAddGroupDelay(group)
		);
	}

	updateAppointmentsCounterSubtract(group: CardsGroup, destinyDropzone: Dropzone): void {
		// /* Si la ficha estaba finalizada, se debe actualizar la info del último día en el que estuvo asignada
		// *  (tanto morning o afternoon, como total, ya que en este caso sí se había contado la ficha según el
		// *  tipo de horario */
		// const originDay = group.cards[0].day;
		// this.appointmentsService.updateAppointment(
		// 	originDay,
		// 	group.cards,
		// 	false,
		// 	true
		// )
	}

	updateAppointmentsCounterAdd(group: CardsGroup, originDropzone: Dropzone): void {}

}
