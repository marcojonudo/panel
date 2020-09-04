import {CardsGroup} from "../cards-group";
import {CardsService} from "../../services/cards.service";
import {Coordinates} from "../coordinates";
import {Mechanic} from "../mechanic";
import {Position} from "../position";
import {ScheduleInterval} from "../schedule-interval";
import {Dayjs} from "dayjs";
import {OverlappedGroupsInfo} from "../groups-translation/overlapped-groups-info";
import {Scroll} from "../scroll";

export interface Dropzone {

	cardsService: CardsService;

	type: string;
	subType: string;
	mechanic: Mechanic;
	interval: ScheduleInterval;
	position: Position;

	validate(coordinates: Coordinates, group: CardsGroup): OverlappedGroupsInfo;

	removeGroup(group: CardsGroup): void;

	updateProperties(groups: CardsGroup[], newStart: Dayjs, line: number, mechanic: Mechanic): boolean;

	addGroup(group: CardsGroup, groups: CardsGroup[], newCard: boolean): void;

	addRealTimeGroup(group: CardsGroup): void;

	findLastCoordinates(group: CardsGroup, coordinates: Coordinates): Coordinates;

	handleNotValidatedMovement(group: CardsGroup): void;

	fixNotValidatedMovementScroll(startPosition: Coordinates, initialScroll: Scroll, scroll: Scroll): Coordinates;

	notify(resetHelperGroup: boolean): void;

}
