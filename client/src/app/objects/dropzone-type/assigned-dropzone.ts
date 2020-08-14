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
import {WarningToast} from "../toasts/warning-toast";

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
		const day = newStart.startOf(Constants.DAY_JS.d);
		if (!groups[0].mechanicCode && !day.isSame(groups[0].cards[0].order.day)) {
			NotificationService.notifyToast(
				new WarningToast(Constants.MESSAGE.DIFFERENT_CARD_DAY(day, groups[0].cards[0].order.day))
			);
		}
		CardsService.updatePositionProperties(
			groups, newStart.startOf(Constants.DAY_JS.d), mechanic.code, line, newStart
		);
	}

	addGroup(group: CardsGroup, groups: CardsGroup[]): void {
		const cardsToUpdate = [].concat(...groups.map((group: CardsGroup) => group.cards));

		CardsService.addToAssigned(group, this.mechanic.day, this.mechanic.code);
		/* Si se acaba de soltar en panel una ficha auxiliar nueva, esta debe crearse en BD, no actualizarse */
		this.checkNewAuxiliaryCard(cardsToUpdate[0])
			? this.cardsService.createDbCards(cardsToUpdate)
			: this.cardsService.updateDbCardsPosition(cardsToUpdate);

		/* Después de la transicíon del grupo a su posición final, se añade a la lista de grupos de destino. Se usa el
		*  timeout para evitar que la ficha aparezca en su lugar de destino antes de que se haya completado el
		*  desplazamiento */
		setTimeout(
			() => this.notify(),
			CardsService.getAddGroupDelay(group)
		);
	}

	addRealTimeGroup(group: CardsGroup): void {
		CardsService.addToAssigned(group, this.mechanic.day, this.mechanic.code);
		if (CardPositionService.checkDraggingGroup(group.id)) {
			CardPositionService.resetDragAction();
			NotificationService.notifyToast(new WarningToast(Constants.MESSAGE.GROUP_UPDATED_REAL_TIME));
		}
	}

	checkNewAuxiliaryCard(card: Card): boolean {
		return card.type == Constants.CARD_TYPE.AUXILIARY && card.lastStatus == Constants.CARD_STATUS.DEFAULT;
	}

	findLastCoordinates(group: CardsGroup, coordinates: Coordinates): Coordinates {
		coordinates.x = CardPositionService.leftToAbsolutePosition(group.left);
		return coordinates;
	}

	handleNotValidatedMovement(group: CardsGroup): void {
		/* Si el movimiento no valida, lo único que hay que hacer es añadir el grupo a su dropzone original (no hay que
		*  actualizar propiedades, ni el panel de citas) */
		setTimeout(
			() => NotificationService.notifyGroups([group], true),
			CardsService.getAddGroupDelay(group)
		);
	}

	notify(resetHelperGroup: boolean = true): void {
		NotificationService.notifyUpdateArray();
		if (resetHelperGroup) {
			/* Además de notificar los grupos de las líneas, se elimina el helper group del overlay. Se hace
			*  aquí (antes se hacía en la directive clickeable) para contemplar también los casos de
			*  actualización en tiempo real */
			CardPositionService.setHelperGroup(undefined);
		}
	}

}
