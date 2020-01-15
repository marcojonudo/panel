import {CardsGroup} from "../cards-group";
import {CardBehaviour} from "./card-behaviour";
import {NotificationService} from "../../services/notification.service";
import {ContextMenuInfo} from "../context-menu-info";
import {Coordinates} from "../coordinates";
import {DayContextMenu} from "../context-menu-update/day-context-menu";
import {MechanicsService} from "../../services/mechanics.service";
import {CardPositionService} from "../../services/card-position.service";

export class AuxiliaryCardBehaviour implements CardBehaviour {

	findHelperGroup: Function;
	handleLeftClick: Function;
	handleRightClick: Function;

	constructor(group: CardsGroup, mechanicsService: MechanicsService) {
		this.findHelperGroup = () => group.clone(true);
		this.handleLeftClick = () => {};
		this.handleRightClick = (coordinates: Coordinates) =>{
			const dayMechanics = mechanicsService.findDayMechanics(group.cards[0].day);
			const top = CardPositionService.findCardTop(dayMechanics, group);
			NotificationService.notifyContextMenu(
				new DayContextMenu(group.cards[0].day, new ContextMenuInfo(group, coordinates, top))
			);
		}
	}

}
