import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {NotificationService} from "../../services/notification.service";
import {ContextMenuInfo} from "../../objects/context-menu-info";
import {CardPositionService} from "../../services/card-position.service";
import {Constants} from "../../objects/constants";
import {CardsService} from "../../services/cards.service";
import {Card} from "../../objects/card";
import {DimensionsService} from "../../services/dimensions.service";
import {DayLateralPanelInfo} from "../../objects/lateral-panel-info/day-lateral-panel-info";
import {CardDetailsInfo} from "../../objects/lateral-panel-info/card-details-info";

@Component({
	selector: 'app-card-context-menu',
	templateUrl: './card-context-menu.component.html',
	styleUrls: ['./card-context-menu.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardContextMenuComponent implements OnInit {

	@Input() contextMenuInfo: ContextMenuInfo;

	private leftOffset: number;

	constructor(private cardsService: CardsService) {}

	ngOnInit(): void {
		this.leftOffset = this.contextMenuInfo && this.contextMenuInfo.group.start
			? Constants.VALUE.MECHANIC_INFO_WIDTH : 0;
	}

	findLeft(
		x: number,
		contextMenuInfo: ContextMenuInfo = this.contextMenuInfo
	): number {
		return contextMenuInfo && contextMenuInfo.group.start ? this.findAssignedLeft(x) : this.findUnassignedLeft(x);
	}

	findAssignedLeft(x: number, leftOffset: number = this.leftOffset): number {
		return CardPositionService.absolutePositionToLeft(x) + leftOffset;
	}

	findUnassignedLeft(x: number): number {
		return x;
	}

	findTop(y: number, contextMenuInfo: ContextMenuInfo = this.contextMenuInfo): number {
		return contextMenuInfo && contextMenuInfo.group.start ? this.findAssignedTop(y) : this.findUnassignedTop();
	}

	findAssignedTop(y: number): number {
		return CardPositionService.absolutePositionToTop(y);
	}

	findUnassignedTop(): number {
		return -((Constants.VALUE.UNASSIGNED_BAR_HEIGHT - Constants.VALUE.LINE_HEIGHT_DEFAULT) / 2 + Constants.VALUE.LINE_HEIGHT_DEFAULT / 2)
	}

	checkCutCardSelected(): boolean {
		return this.contextMenuInfo.group.mode == Constants.GROUP_MODE.CUT;
	}

	cutCard(): void {
		this.cardsService.updateCardMode([this.contextMenuInfo.group], Constants.GROUP_MODE.CUT);
	}

	cutCardByHalf(contextMenuInfo: ContextMenuInfo = this.contextMenuInfo, leftOffset: number = this.leftOffset): void {
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
			new DayLateralPanelInfo(
				clickedCard.day,
				new CardDetailsInfo(clickedCard)
			)
		);
		NotificationService.notifyContextMenu(undefined);
	}

}
