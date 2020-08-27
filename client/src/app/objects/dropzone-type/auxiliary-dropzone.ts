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
import {Dayjs} from "dayjs";
import {OverlappedGroupsInfo} from "../groups-translation/overlapped-groups-info";
import {WarningToast} from "../toasts/warning-toast";

export class AuxiliaryDropzone implements Dropzone {

	cardsService: CardsService;
	appointmentsService: AppointmentsService;

	type: string = Constants.DROPZONE_TYPE.AUXILIARY;
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
		CardsService.auxiliaryGroup = undefined;
	}

	updateProperties(groups: CardsGroup[], newStart: Dayjs, line: number, mechanic: Mechanic): void {
		CardsService.resetCardsGroup(groups[0]);
	}

	addGroup(group: CardsGroup): void {
		this.cardsService.updateDbCardsPosition(group.cards);
		CardsService.addToUnassigned(group);
		this.notify();
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

	handleNotValidatedMovement(group: CardsGroup): void {}

	notify(resetHelperGroup: boolean = true): void {
		NotificationService.notifyBand();
		if (resetHelperGroup) {
			CardPositionService.setHelperGroup(undefined);
		}
	}

}
