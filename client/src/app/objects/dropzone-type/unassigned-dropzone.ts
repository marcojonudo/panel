import {CardsGroup} from "../cards-group";
import {Constants} from "../constants";
import {Mechanic} from "../mechanic";
import {Dropzone} from "./dropzone";
import {CardPositionService} from "../../services/card-position.service";
import {CardsService} from "../../services/cards.service";
import {Coordinates} from "../coordinates";
import {NotificationService} from "../../services/notification.service";
import {AppointmentsService} from "../../services/appointments.service";
import {Position} from "../position";
import {ScheduleInterval} from "../schedule-interval";
import {OverlappedGroupsInfo} from "../groups-translation/overlapped-groups-info";
import {Dayjs} from "dayjs";
import {WarningToast} from "../toasts/warning-toast";

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

	removeGroup(group: CardsGroup): void {
		CardsService.removeFromUnassigned(group);
	}

	updateProperties(groups: CardsGroup[]): void {
		CardsService.resetCardsGroup(groups[0]);
	}

	addGroup(group: CardsGroup): void {
		const visibleSection = group.cards[0].type == this.subType;
		/* Si la ficha es del tipo abierto en la cinta, se ejecuta el CD para que, antes de completar la transición,
		*  el resto de fichas se desplacen para dejarle hueco a esta */
		CardsService.addToUnassigned(group, visibleSection);
		this.cardsService.updateDbCardsPosition(group.cards);
		/* Sólo se ejecuta la transición está abierta la sección de la cinta correspondiente al tipo de ficha */
		if (visibleSection) {
			setTimeout(
				() => this.notify(),
				CardsService.getAddGroupDelay(group)
			);
		} else {
			this.notify();
		}
	}

	addRealTimeGroup(group: CardsGroup): void {
		CardsService.addToUnassigned(group);
		if (CardPositionService.checkDraggingGroup(group.id)) {
			CardPositionService.resetDragAction();
			NotificationService.notifyToast(new WarningToast(Constants.MESSAGE.GROUP_UPDATED_REAL_TIME));
		}
	}

	findLastCoordinates(group: CardsGroup, coordinates: Coordinates): Coordinates {
		return new Coordinates(group.left, CardPositionService.unassignedCardTop);
	}

	handleNotValidatedMovement(group: CardsGroup): void {
		setTimeout(
			() => this.notify(),
			CardsService.getAddGroupDelay(group)
		);
	}

	notify(resetHelperGroup: boolean = true): void {
		NotificationService.notifyBand();
		if (resetHelperGroup) {
			CardPositionService.setHelperGroup(undefined);
		}
	}

}
