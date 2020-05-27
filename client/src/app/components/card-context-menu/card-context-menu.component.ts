import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {NotificationService} from "../../services/notification.service";
import {CardPositionService} from "../../services/card-position.service";
import {Constants} from "../../objects/constants";
import {CardsService} from "../../services/cards.service";
import {Card} from "../../objects/card";
import {DimensionsService} from "../../services/dimensions.service";
import {DayLateralPanelInfo} from "../../objects/lateral-panel-info/day-lateral-panel-info";
import {CardDetailsInfo} from "../../objects/lateral-panel-info/card-details-info";
import {GroupContextMenuInfo} from "../../objects/context-menu/group-context-menu-info";

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

	get cardContextMenuId(): string {
		return Constants.ID.CARD_CONTEXT_MENU;
	}

	findLeft(x: number): number {
		return x;
	}

	findTop(y: number, contextMenuInfo: GroupContextMenuInfo = this.contextMenuInfo): number {
		return contextMenuInfo.group.start ? y : undefined;
	}

	findBottom(y: number, contextMenuInfo: GroupContextMenuInfo = this.contextMenuInfo): number {
		/* Si se abre el menú contextual en una ficha no asinada, el popup debe aparecer hacia arriba, para no salirse
		*  de la pantalla */
		return contextMenuInfo.group.start ? undefined : window.innerHeight - y;
	}

	checkCutCardSelected(): boolean {
		return this.contextMenuInfo.group.mode == Constants.GROUP_MODE.CUT;
	}

	cutCard(): void {
		CardsService.updateCardMode([this.contextMenuInfo.group], Constants.GROUP_MODE.CUT);
	}

	cutCardByHalf(contextMenuInfo: GroupContextMenuInfo = this.contextMenuInfo, leftOffset: number = this.leftOffset): void {
		const groupX = contextMenuInfo.group.start
			? contextMenuInfo.group.left : CardPositionService.barLeftToAbsolutePosition(contextMenuInfo.group.left);
		this.cardsService.cutCardByHalf(
			contextMenuInfo.group,
			groupX,
			contextMenuInfo.clickCoordinates.x - leftOffset
		);
		NotificationService.notifyContextMenu(undefined);
	}

	showCardDetails(): void {
		const xLeft = this.contextMenuInfo.clickCoordinates.x - Constants.VALUE.MECHANIC_INFO_WIDTH;
		const clickedCard = this.contextMenuInfo.group.cards.find((card: Card) =>
			DimensionsService.calcLeftFromStart(card.end) > xLeft
		);
		NotificationService.notifyLateralInfo(
			new DayLateralPanelInfo(clickedCard.day, new CardDetailsInfo(clickedCard))
		);
		NotificationService.notifyContextMenu(undefined);
	}

}
