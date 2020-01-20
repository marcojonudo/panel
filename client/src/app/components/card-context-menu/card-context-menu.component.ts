import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {NotificationService} from "../../services/notification.service";
import {Subscription} from "rxjs/internal/Subscription";
import {CardsGroup} from "../../objects/cards-group";
import {ContextMenuInfo} from "../../objects/context-menu-info";
import {Coordinates} from "../../objects/coordinates";
import {CardPositionService} from "../../services/card-position.service";
import {Constants} from "../../objects/constants";
import {CardsService} from "../../services/cards.service";
import {DayContextMenu} from "../../objects/context-menu-update/day-context-menu";
import {DayCardDetails} from "../../objects/card-details-update/day-card-details";
import {Card} from "../../objects/card";
import {DimensionsService} from "../../services/dimensions.service";

@Component({
	selector: 'app-card-context-menu',
	templateUrl: './card-context-menu.component.html',
	styleUrls: ['./card-context-menu.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardContextMenuComponent {

	@Input() contextMenuInfo: ContextMenuInfo;

	constructor(private cardsService: CardsService) {}

	findLeft(x: number): number {
		return CardPositionService.absolutePositionToLeft(x) + Constants.VALUE.MECHANIC_INFO_WIDTH;
	}

	findTop(y: number): number {
		return CardPositionService.absolutePositionToTop(y)
	}

	cutCard(): void {
		this.cardsService.updateCardMode(this.contextMenuInfo.group, Constants.GROUP_MODE.CUT);
	}

	cutCardByHalf(): void {
		this.cardsService.cutCardByHalf(this.contextMenuInfo.group, this.contextMenuInfo.clickCoordinates.x);
		NotificationService.notifyContextMenu(
			new DayContextMenu(this.contextMenuInfo.group.cards[0].day, undefined)
		);
	}

	showCardDetails(): void {
		const xLeft = this.contextMenuInfo.clickCoordinates.x - Constants.VALUE.MECHANIC_INFO_WIDTH;
		const clickedCard = this.contextMenuInfo.group.cards.find((card: Card) =>
			DimensionsService.calcLeftFromStart(card.end) > xLeft
		);
		NotificationService.notifyCardDetails(new DayCardDetails(clickedCard.day, clickedCard));
		NotificationService.notifyContextMenu(
			new DayContextMenu(clickedCard.day, undefined)
		);
	}

}
