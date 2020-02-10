import {CardsGroup} from "../cards-group";
import {CardTypeBehaviour} from "./card-type-behaviour";
import {NotificationService} from "../../services/notification.service";
import {ContextMenuInfo} from "../context-menu-info";
import {Coordinates} from "../coordinates";
import {CardsService} from "../../services/cards.service";

export class AuxiliaryCardBehaviour implements CardTypeBehaviour {

	findHelperGroup: Function;
	handleLeftClick: Function;
	handleRightClick: Function;

	constructor(cardsService: CardsService) {
		this.findHelperGroup = (group) => group.start ? group : group.clone(true);
		this.handleLeftClick = (group: CardsGroup, x: number) =>
			cardsService.findCardModeAction(group.mode).execute(group, x);
		this.handleRightClick = (group: CardsGroup, coordinates: Coordinates) =>{
			NotificationService.notifyContextMenu(new ContextMenuInfo(group, coordinates));
		}
	}

}
