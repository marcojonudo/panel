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
import {Dayjs} from "dayjs";
import {OverlappedGroupsInfo} from "../groups-translation/overlapped-groups-info";
import {NotificationService} from "../../services/notification.service";
import {WarningToast} from "../toasts/warning-toast";

export class FinishDropzone implements Dropzone {

	cardsService: CardsService;
	appointmentsService: AppointmentsService;

	type: string = Constants.DROPZONE_TYPE.FINISH;
	subType: string;
	mechanic: Mechanic;
	interval: ScheduleInterval;
	position: Position;

	constructor(
		cardsService: CardsService,
		appointmentsService: AppointmentsService
	) {
		this.cardsService = cardsService;
		this.appointmentsService = appointmentsService;
	}

	validate(coordinates: Coordinates, group: CardsGroup): OverlappedGroupsInfo {
		return new OverlappedGroupsInfo();
	}

	removeGroup(group: CardsGroup): void {}

	updateProperties(groups: CardsGroup[], newStart: Dayjs, line: number, mechanic: Mechanic): void {
		CardsService.updateFinishedGroup(groups[0]);
	}

	addGroup(groups: CardsGroup[], group: CardsGroup): void {
		this.cardsService.updateDbCardsPosition(group.cards);
		CardsService.addToFinished(group);
		this.notify();
	}

	addRealTimeGroup(group: CardsGroup): void {
		CardsService.addToFinished(group);
		if (CardPositionService.checkDraggingGroup(group.id)) {
			CardPositionService.resetDragAction();
			NotificationService.notifyToast(new WarningToast(Constants.MESSAGE.GROUP_UPDATED_REAL_TIME));
		}
	}

	findLastCoordinates(group: CardsGroup, coordinates: Coordinates): Coordinates {
		return coordinates;
	}

	handleNotValidatedMovement(group: CardsGroup): void {}

	notify(resetHelperGroup: boolean = true): void {
		NotificationService.notifyBand();
		if (resetHelperGroup) {
			CardPositionService.setHelperGroup(undefined);
		}
	}

}
