import {CardsGroup} from "../cards-group";
import {Constants} from "../constants";
import {Mechanic} from "../mechanic";
import {Dropzone} from "./dropzone";
import {CardPositionService} from "../../services/card-position.service";
import {CardsService} from "../../services/cards.service";
import {Coordinates} from "../coordinates";
import {AppointmentsService} from "../../services/appointments.service";
import {Position} from "../position";
import {ScheduleInterval} from "../schedule-interval";
import {Card} from "../card";
import {NotificationService} from "../../services/notification.service";
import {Dayjs} from "dayjs";
import {OverlappedGroupsInfo} from "../groups-translation/overlapped-groups-info";

export class AssignedDropzone implements Dropzone {

	cardsService: CardsService;
	appointmentsService: AppointmentsService;

	type: string = Constants.DROPZONE_TYPE.ASSIGNED;
	subType: string;
	mechanic: Mechanic;
	interval: ScheduleInterval;
	position: Position;

	constructor(
		cardsService: CardsService,
		appointmentsService: AppointmentsService,
		mechanic: Mechanic,
		interval: ScheduleInterval
	) {
		this.cardsService = cardsService;
		this.appointmentsService = appointmentsService;
		this.mechanic = mechanic;
		this.interval = interval;
	}

	validate(coordinates: Coordinates, group: CardsGroup): OverlappedGroupsInfo {
		const dayMechanicGroups = CardsService.findDayMechanicGroups(this.mechanic.day, this.mechanic.code);
		const validateInfo = CardPositionService.validateCoordinates(coordinates, this, dayMechanicGroups, group);
		return this.validateOverlappedGroups(
			group, dayMechanicGroups, validateInfo.line, validateInfo.newStart, validateInfo.newEnd, this.interval
		)
	}

	validateOverlappedGroups(
		group: CardsGroup,
		dayMechanicGroups: CardsGroup[],
		line: number,
		newStart: Dayjs,
		newEnd: Dayjs,
		dropzoneInterval: ScheduleInterval
	): OverlappedGroupsInfo {
		/* Para validar si la posición es correcta, se deben tener en cuenta los grupos solapados. Estos grupos sólo
		*  pueden ser aquellos que no sean el que se está moviendo (si este parte desde la derecha), y los que estén
		*  en la misma línea más tarde que el nuevo start */
		const lineRightGroups = dayMechanicGroups.filter((g: CardsGroup) =>
			g.id != group.id && g.line == line && g.end.isAfter(newStart)
		);
		const overlappedGroupsInfo = CardPositionService.handleOverlappedMovements(newEnd, lineRightGroups)
			.setNewStart(newStart);
		return newStart >= dropzoneInterval.start && overlappedGroupsInfo.newEnd <= dropzoneInterval.end ?
			overlappedGroupsInfo : undefined;
	}

	removeGroup(group: CardsGroup): void {
		CardsService.removeFromAssigned(group, this.mechanic.day, this.mechanic.code);
	}

	updateProperties(groups: CardsGroup[], newStart: Dayjs, line: number, mechanic: Mechanic): void {
		CardsService.updatePositionProperties(
			groups, newStart.startOf(Constants.DAY_JS.d), mechanic.code, line, newStart
		);
	}

	addGroup(groups: CardsGroup[], group: CardsGroup): void {
		const cardsToUpdate = [].concat(...groups.map((group: CardsGroup) => group.cards));

		/* Si se está actualizando en tiempo real, no hay fichas para actualizar en BD (ya se actualizaron al realizar
		*  el movimiento en el terminal original) */
		if (cardsToUpdate.length) {
			/* Si se acaba de soltar en panel una ficha auxiliar nueva, esta debe crearse en BD, no actualizarse */
			this.checkNewAuxiliaryCard(cardsToUpdate[0])
				? this.cardsService.createDbCards(cardsToUpdate)
				: this.cardsService.updateDbCardsPosition(cardsToUpdate);
		}

		CardsService.addToAssigned(group, this.mechanic.day, this.mechanic.code);

		/* Después de la transicíon del grupo a su posición final, se añade a la lista de grupos de destino. Se usa el
		*  timeout para evitar que la ficha aparezca en su lugar de destino antes de que se haya completado el
		*  desplazamiento */
		setTimeout(
			() => NotificationService.notifyUpdateArray(),
			CardPositionService.getAddGroupDelay(group)
		);
	}

	checkNewAuxiliaryCard(card: Card): boolean {
		return card.type == Constants.CARD_TYPE.AUXILIARY && card.lastStatus == Constants.CARD_STATUS.DEFAULT;
	}

	findLastCoordinates(group: CardsGroup, coordinates: Coordinates): Coordinates {
		return coordinates;
	}

	handleNotValidatedMovement(group: CardsGroup): void {
		/* Si el movimiento no valida, lo único que hay que hacer es añadir el grupo a su dropzone original (no hay que
		*  actualizar propiedades, ni el panel de citas) */
		setTimeout(
			() => NotificationService.notifyGroups([group], true),
			CardPositionService.getAddGroupDelay(group)
		);
	}

}
