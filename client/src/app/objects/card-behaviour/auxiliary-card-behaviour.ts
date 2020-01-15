import {CardsGroup} from "../cards-group";
import {CardBehaviour} from "./card-behaviour";
import {NotificationService} from "../../services/notification.service";
import {ContextMenuInfo} from "../context-menu-info";
import {Coordinates} from "../coordinates";
import {DayContextMenu} from "../context-menu-update/day-context-menu";

export class AuxiliaryCardBehaviour implements CardBehaviour {

	findHelperGroup: Function;
	handleLeftClick: Function;
	handleRightClick: Function;

	constructor(group: CardsGroup) {
		this.findHelperGroup = () => group.clone(true);
		this.handleLeftClick = () => {};
		this.handleRightClick = (coordinates: Coordinates) =>
			NotificationService.notifyContextMenu(
				new DayContextMenu(group.cards[0].day, new ContextMenuInfo(group, coordinates))
			);
	}

}
