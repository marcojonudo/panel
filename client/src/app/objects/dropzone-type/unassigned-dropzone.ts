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

	updateProperties(groups: CardsGroup[], newStart: Dayjs, line: number, mechanic: Mechanic): void {
		CardsService.resetCardsGroup(groups[0]);
	}

	addGroup(groups: CardsGroup[], group: CardsGroup): void {
		CardsService.addToUnassigned(group);

		this.cardsService.updateDbCardsPosition(group.cards);

		/* Terminada la transición, se ejecuta el CD para que se elimine el hidden del grupo añadido */
		setTimeout(
			() => this.notify(),
			CardsService.getAddGroupDelay(group)
		);
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
			() => NotificationService.notifyBand(undefined, [group]),
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
