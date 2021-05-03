import {CardsGroup} from "../cards-group";
import {Constants} from "../constants";
import {Mechanic} from "../mechanic";
import {Dropzone} from "./dropzone";
import {CardPositionService} from "../../services/card-position.service";
import {CardsService} from "../../services/cards.service";
import {Coordinates} from "../coordinates";
import {AppointmentsService} from "../../services/appointments.service";
import {Position} from "../position";
import {Dayjs} from "dayjs";
import {OverlappedGroupsInfo} from "../groups-translation/overlapped-groups-info";
import {NotificationService} from "../../services/notification.service";
import {WarningToast} from "../toasts/warning-toast";
import {Scroll} from "../scroll";
import {ScheduleInterval} from "../schedule-interval";

export class FinishDropzone implements Dropzone {

	cardsService: CardsService;
	appointmentsService: AppointmentsService;

	type: string = Constants.DROPZONE_TYPE.FINISH;
	subType: string;
	mechanic: Mechanic;
	interval: ScheduleInterval;
	position: Position;

	g: CardsGroup;

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

	updateProperties(groups: CardsGroup[], newStart: Dayjs, line: number, mechanic: Mechanic): boolean {
		CardsService.updateFinishedGroup(groups[0]);
		return false;
	}

	addGroup(group: CardsGroup, groups: CardsGroup[]): void {
		this.cardsService.updateDbCardsPosition(group.cards);
		CardsService.addFinishedGroup(group);
		this.notify();
	}

	addRealTimeGroup(group: CardsGroup): void {
		CardsService.addFinishedGroup(group);
		if (CardPositionService.checkDraggingGroup(group.id)) {
			CardPositionService.resetDragAction();
			NotificationService.notifyToast(new WarningToast(Constants.MESSAGE.GROUP_UPDATED_REAL_TIME));
		}
	}

	findLastCoordinates(group: CardsGroup, coordinates: Coordinates): Coordinates {
		return coordinates;
	}

	handleNotValidatedMovement(group: CardsGroup): void {}

	fixNotValidatedMovementScroll(startPosition: Coordinates, initialScroll: Scroll, scroll: Scroll): Coordinates {
		return undefined;
	}


	notify(resetHelperGroup: boolean = true): void {
		/* Se elimina el hiddenGroup aquí, en lugar de en la directiva clickeable, porque el evento de esta última
		*  se lanza después de pasar por este código. En ese caso, cuando se ejecuta el CD de la cinta sigue estando
		*  el grupo qeu se soltó como hidden */
		CardPositionService.hiddenGroup = undefined;
		NotificationService.notifyBand();
		if (resetHelperGroup) {
			CardPositionService.setHelperGroup(undefined);
		}
	}

}
