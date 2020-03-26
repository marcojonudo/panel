import {CardsGroup} from "../cards-group";
import {Constants} from "../constants";
import {Mechanic} from "../mechanic";
import {Dropzone} from "./dropzone";
import {CardPositionService} from "../../services/card-position.service";
import {CardsService} from "../../services/cards.service";
import {Coordinates} from "../coordinates";
import {AppointmentsService} from "../../services/appointments.service";
import {UpdateAppointmentDayParams} from "../update-appointment-day-params";
import {Position} from "../position";
import {ScheduleInterval} from "../schedule-interval";
import {Card} from "../card";

export class AssignedDropzone implements Dropzone {

	cardsService: CardsService;
	appointmentsService: AppointmentsService;

	type: string = Constants.DROPZONE_TYPE.ASSIGNED;
	subType: string;
	mechanic: Mechanic;
	interval: ScheduleInterval;
	position: Position;

	dayMechanicGroups: CardsGroup[];

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

	validateCoordinates(coordinates: Coordinates): Coordinates {
		this.dayMechanicGroups = CardsService.findDayMechanicGroups(this.mechanic.day, this.mechanic.code);
		return CardPositionService.validateCoordinates(coordinates, this.dayMechanicGroups);
	}

	findGroupsToUpdate(group: CardsGroup, line: number): CardsGroup[] {
		const dayMechanicGroups = CardsService.findDayMechanicGroups(this.mechanic.day, this.mechanic.code);
		return CardPositionService.findGroupsToUpdate(group, dayMechanicGroups, line, this);
	}

	removeGroup(group: CardsGroup, validated: boolean, destinyDropzone: Dropzone): void {
		if (destinyDropzone) {
			this.updateAppointmentsCounterSubtract(group, destinyDropzone);
		}
		CardsService.removeFromAssigned(group, this.mechanic.day, this.mechanic.code);
	}

	findLastCoordinates(groups: CardsGroup[], group: CardsGroup, coordinates: Coordinates): Coordinates {
		/* Se actualiza el left, start y end de los grupos y se retorna la posición final a la que se tendrá que
		*  desplazar la ficha, una vez tenidos en cuenta los solapamientos */
		return CardPositionService.updateAssignedGroupsPosition(coordinates, groups);
	}

	addGroup(
		groups: CardsGroup[],
		group: CardsGroup,
		originDropzone: Dropzone,
		line: number
	): void {
		const dayMechanicGroups = this.dayMechanicGroups
			? this.dayMechanicGroups
			: CardsService.findDayMechanicGroups(this.mechanic.day, this.mechanic.code);
		CardsService.updateAssignedCards(groups, group, this.mechanic.day, this.mechanic.code, line, dayMechanicGroups);

		const cardsToUpdate = [].concat(...groups.map((group: CardsGroup) => group.cards));
		this.checkNewAuxiliaryCard(cardsToUpdate[0])
			? this.cardsService.createDbCards(cardsToUpdate)
			: this.cardsService.updateDbCardsPosition(cardsToUpdate);
		this.updateAppointmentsCounterAdd(group, originDropzone);

		/* Después de la transicíon del grupo a su posición final, se añade a la lista de grupos de destino. Se usa el
		*  timeout para evitar que la ficha aparezca en su lugar de destino antes de que se haya completado el
		*  desplazamiento */
		setTimeout(
			() => CardsService.addToAssigned(group, this.mechanic.day, this.mechanic.code),
			CardPositionService.getAddGroupDelay(group)
		);
	}

	checkNewAuxiliaryCard(card: Card): boolean {
		return card.type == Constants.CARD_TYPE.AUXILIARY && card.lastStatus == Constants.CARD_STATUS.DEFAULT;
	}

	handleNotValidatedMovement(group: CardsGroup): void {
		/* Si el movimiento no valida, lo único que hay que hacer es añadir el grupo a su dropzone original (no hay que
		*  actualizar propiedades, ni el panel de citas) */
		setTimeout(
			() => CardsService.addToAssigned(group, this.mechanic.day, this.mechanic.code),
			CardPositionService.getAddGroupDelay(group)
		);
	}

	updateAppointmentsCounterSubtract(group: CardsGroup, destinyDropzone: Dropzone): void {
		/* Sólo se tiene que reducir el contador de citas si una ficha se mueve de asignada a asignada (restar en una
		*  categoría y sumar en otra), o de asignada a no asignada (restar en una categoría). Si se mueve a otra
		*  dropzone (finalizada), no se resta nada al contador de citas */
		if (destinyDropzone.type != Constants.DROPZONE_TYPE.FINISH) {
			this.appointmentsService.updateAppointment(
				group.cards[0].day,
				group.cards,
				false,
				new UpdateAppointmentDayParams(false, true)
			);
		}
	}

	updateAppointmentsCounterAdd(group: CardsGroup, originDropzone: Dropzone): void {
		this.appointmentsService.updateAppointment(
			group.cards[0].day,
			group.cards,
			true,
			new UpdateAppointmentDayParams(false, true),
			true
		)
	}

}
