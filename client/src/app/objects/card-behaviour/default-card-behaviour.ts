import {CardsGroup} from "../cards-group";
import {CardBehaviour} from "./card-behaviour";
import {DayCardDetails} from "../card-details-update/day-card-details";
import {NotificationService} from "../../services/notification.service";
import {ContextMenuInfo} from "../context-menu-info";
import {Coordinates} from "../coordinates";
import {DayContextMenu} from "../context-menu-update/day-context-menu";

export class DefaultCardBehaviour implements CardBehaviour{

	findHelperGroup: Function;
	handleLeftClick: Function;
	handleRightClick: Function;

	constructor(group: CardsGroup) {
		this.findHelperGroup = () => group;
		this.handleLeftClick = () =>
			NotificationService.notifyCardDetails(
				new DayCardDetails(group.cards[0].day, group.cards[0])
			);
		this.handleRightClick = (coordinates: Coordinates) =>
			NotificationService.notifyContextMenu(
				new DayContextMenu(group.cards[0].day, new ContextMenuInfo(group, coordinates))
			);
	}

}
