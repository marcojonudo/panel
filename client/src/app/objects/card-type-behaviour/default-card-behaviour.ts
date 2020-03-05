import {CardsGroup} from "../cards-group";
import {CardTypeBehaviour} from "./card-type-behaviour";
import {NotificationService} from "../../services/notification.service";
import {Coordinates} from "../coordinates";
import {CardsService} from "../../services/cards.service";
import {GroupContextMenuInfo} from "../context-menu/group-context-menu-info";

export class DefaultCardBehaviour implements CardTypeBehaviour{

	findHelperGroup: Function;
	handleLeftClick: Function;
	handleRightClick: Function;

	//TODO Definir funciones
	constructor(cardsService: CardsService) {
		this.findHelperGroup = (group: CardsGroup) => group;
		this.handleLeftClick = (group: CardsGroup, x: number) =>
			cardsService.findCardModeAction(group.mode).execute(group, x);
		this.handleRightClick = (group: CardsGroup, coordinates: Coordinates) => {
			NotificationService.notifyContextMenu(new GroupContextMenuInfo(group, coordinates));
		}
	}

}
