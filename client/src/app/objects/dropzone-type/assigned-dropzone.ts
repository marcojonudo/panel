import {CardsGroup} from "../cards-group";
import {Constants} from "../constants";
import {Mechanic} from "../mechanic";
import {Dropzone} from "./dropzone";
import {CardPositionService} from "../../services/card-position.service";
import {CardsService} from "../../services/cards.service";
import {Coordinates} from "../coordinates";
import {AppointmentsService} from "../../services/appointments.service";
import {UpdateAppointmentDayParams} from "../update-appointment-day-params";

export class AssignedDropzone implements Dropzone {

	cardsService: CardsService;
	appointmentsService: AppointmentsService;

	type: string = Constants.DROPZONE_TYPE.ASSIGNED;
	subType: string;
	mechanic: Mechanic;
	rect: any;

	dayMechanicGroups: CardsGroup[];

	constructor(
		cardsService: CardsService,
		appointmentsService: AppointmentsService,
		mechanic: Mechanic
	) {
		this.cardsService = cardsService;
		this.appointmentsService = appointmentsService;
		this.mechanic = mechanic;
	}

	validateMovement(position: Coordinates): CardsGroup[] {
		this.dayMechanicGroups = this.cardsService.findDayMechanicGroups(this.mechanic.day, this.mechanic.code);
		return CardPositionService.validateAssignedPosition(
			position,
			this.dayMechanicGroups
		);
	}

	removeGroup(group: CardsGroup, validated: boolean, destinyDropzone: Dropzone): void {
		if (destinyDropzone) {
			this.updateAppointmentsCounterSubtract(group, destinyDropzone);
		}
		this.cardsService.removeFromAssigned(group, this.mechanic.day, this.mechanic.code);
	}

	findLastPosition(groups: CardsGroup[], group: CardsGroup, position: Coordinates): Coordinates {
		/* Se actualiza el left, start y end de los grupos y se retorna la posición final a la que se tendrá que
		*  desplazar la ficha, una vez tenidos en cuenta los solapamientos */
		return CardPositionService.updateAssignedGroupsPosition(
			position,
			groups
		);
	}

	addGroup(
		groups: CardsGroup[],
		group: CardsGroup,
		originDropzone: Dropzone,
		lastPosition: Coordinates
	): void {
		this.cardsService.updateAssignedCards(
			groups,
			group,
			this.mechanic.day,
			this.mechanic.code,
			lastPosition.line,
			this.dayMechanicGroups
		);
		this.updateAppointmentsCounterAdd(group, originDropzone);

		/* Después de la transicíon del grupo a su posición final, se añade a la lista de grupos de destino. Se usa el
		*  timeout para evitar que la ficha aparezca en su lugar de destino antes de que se haya completado el
		*  desplazamiento */
		setTimeout(
			() => this.cardsService.addToAssigned(group, this.mechanic.day, this.mechanic.code),
			Constants.VALUE.CARD_MOVEMENT_DURATION
		);
	}

	handleNotValidatedMovement(group: CardsGroup): void {
		/* Si el movimiento no valida, lo único que hay que hacer es añadir el grupo a su dropzone original (no hay que
		*  actualizar propiedades, ni el panel de citas) */
		setTimeout(
			() => this.cardsService.addToAssigned(group, this.mechanic.day, this.mechanic.code),
			Constants.VALUE.CARD_MOVEMENT_DURATION
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
