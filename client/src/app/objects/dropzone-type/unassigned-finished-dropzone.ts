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
		return new OverlappedGroupsInfo();
	}

	removeGroup(group: CardsGroup): void {
		CardsService.removeFromUnassigned(group);
	}

	updateProperties(groups: CardsGroup[], newStart: Dayjs, line: number, mechanic: Mechanic): void {
		CardsService.resetCardsGroup(groups[0]);
	}

	addGroup(groups: CardsGroup[], group: CardsGroup): void {
		this.cardsService.updateDbCardsPosition(group.cards);
		CardsService.addToUnassigned(group);

		/* Se notifica el helper group para que desaparezca del overlay. No hace falta notificar a la cinta, ya que se
		*  actualizará su contenido cuando se salga de la zona de finalizadas */
		CardPositionService.setHelperGroup(undefined);
	}

	findLastCoordinates(group: CardsGroup, coordinates: Coordinates): Coordinates {
		return new Coordinates(group.left, CardPositionService.unassignedCardTop);
	}

	handleNotValidatedMovement(group: CardsGroup): void {
		setTimeout(
			() => CardsService.addToUnassigned(group),
			CardPositionService.getAddGroupDelay(group)
		);
	}

}
