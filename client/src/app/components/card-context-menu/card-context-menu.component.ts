import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {NotificationService} from "../../services/notification.service";
import {CardPositionService} from "../../services/card-position.service";
import {Constants} from "../../objects/constants";
import {CardsService} from "../../services/cards.service";
import {Card} from "../../objects/card";
import {DimensionsService} from "../../services/dimensions.service";
import {CardDetailsInfo} from "../../objects/lateral-panel-info/card-details-info";
import {GroupContextMenuInfo} from "../../objects/context-menu/group-context-menu-info";
import {CardsGroup} from "../../objects/cards-group";
import {WarningToast} from "../../objects/toasts/warning-toast";

@Component({
	selector: 'app-card-context-menu',
	templateUrl: './card-context-menu.component.html',
	styleUrls: ['./card-context-menu.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardContextMenuComponent implements OnInit {

	@Input() contextMenuInfo: GroupContextMenuInfo;

	private leftOffset: number;

	constructor(private cardsService: CardsService) {}

	ngOnInit(): void {
		this.leftOffset = this.contextMenuInfo && this.contextMenuInfo.group.start
			? Constants.VALUE.MECHANIC_INFO_WIDTH : 0;
	}

	checkShowDetails(group: CardsGroup = this.contextMenuInfo.group): boolean {
		return group.cards[0].type != Constants.CARD_TYPE.AUXILIARY;
	}

	checkCutCardSelected(): boolean {
		return this.contextMenuInfo.group.mode == Constants.GROUP_MODE.CUT;
	}

	cutCard(): void {
		CardsService.updateCardMode([this.contextMenuInfo.group], Constants.GROUP_MODE.CUT);
	}

	cutCardByHalf(
		contextMenuInfo: GroupContextMenuInfo = this.contextMenuInfo, leftOffset: number = this.leftOffset
	): void {
		const groupX = contextMenuInfo.group.start
			? contextMenuInfo.group.left : CardPositionService.barLeftToAbsolutePosition(contextMenuInfo.group.left);
		const translatedGroups = this.cardsService.cutCardByHalf(
			contextMenuInfo.group,
			groupX,
			CardPositionService.absolutePositionToLeft(contextMenuInfo.clickCoordinates.x)
		);
		NotificationService.notifyContextMenu(undefined);
		NotificationService.notifyGroups(translatedGroups.concat([contextMenuInfo.group]), true);
	}

	showCardDetails(): void {
		const xLeft = this.contextMenuInfo.clickCoordinates.x - Constants.VALUE.MECHANIC_INFO_WIDTH;
		const clickedCard = this.contextMenuInfo.group.cards.find((card: Card) =>
			DimensionsService.calcLeftFromStart(card.end) > xLeft
		);
		NotificationService.notifyContextMenu(undefined);
		NotificationService.notifyLateralInfo(clickedCard.day, new CardDetailsInfo(clickedCard), true)
	}

	replaceCard(group: CardsGroup = this.contextMenuInfo.group): void {
		/* Obligatoriamente tiene que haber grupos no asignados para poder reemplazar una ficha temporal */
		if (CardsService.unassignedGroups.length) {
			CardsService.auxiliaryGroupToReplace = group;
			CardsService.updateCardMode(CardsService.unassignedGroups, Constants.GROUP_MODE.REPLACE);
		} else {
			NotificationService.notifyToast(new WarningToast(Constants.MESSAGE.NO_UNASSIGNED_GROUPS_TO_REPLACE));
		}
		NotificationService.notifyContextMenu(undefined, true);
	}

}
