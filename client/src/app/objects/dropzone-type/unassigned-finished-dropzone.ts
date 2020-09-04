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
import {OverlappedGroupsInfo} from "../groups-translation/overlapped-groups-info";
import {Dayjs} from "dayjs";
import {NotificationService} from "../../services/notification.service";
import {WarningToast} from "../toasts/warning-toast";
import {Scroll} from "../scroll";

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
		return group.cards[0].type == Constants.CARD_TYPE.AUXILIARY ? undefined : new OverlappedGroupsInfo();
	}

	removeGroup(group: CardsGroup): void {
		CardsService.removeFinishedCardsGroup(group);
		this.notify(false);
	}

	updateProperties(groups: CardsGroup[], newStart: Dayjs, line: number, mechanic: Mechanic): boolean {
		CardsService.resetCardsGroup(groups[0]);
		return false;
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

	handleNotValidatedMovement(group: CardsGroup): void {
		setTimeout(
			() => this.notify(),
			CardsService.getAddGroupDelay(group)
		);
	}

	fixNotValidatedMovementScroll(startPosition: Coordinates, initialScroll: Scroll, scroll: Scroll): Coordinates {
		return startPosition;
	}


	notify(resetHelperGroup: boolean = true): void {
		CardPositionService.hiddenGroup = undefined;
		NotificationService.notifyBand();
		if (resetHelperGroup) {
			/* Se notifica el helper group para que desaparezca del overlay. No hace falta notificar a la cinta, ya que se
			*  actualizará su contenido cuando se salga de la zona de finalizadas */
			CardPositionService.setHelperGroup(undefined);
		}
	}

}
