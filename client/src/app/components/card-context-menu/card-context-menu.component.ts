import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {NotificationService} from "../../services/notification.service";
import {Subscription} from "rxjs/internal/Subscription";
import {CardsGroup} from "../../objects/cards-group";
import {ContextMenuInfo} from "../../objects/context-menu-info";
import {Coordinates} from "../../objects/coordinates";
import {CardPositionService} from "../../services/card-position.service";
import {Constants} from "../../objects/constants";

@Component({
	selector: 'app-card-context-menu',
	templateUrl: './card-context-menu.component.html',
	styleUrls: ['./card-context-menu.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardContextMenuComponent {

	@Input() contextMenuInfo: ContextMenuInfo;

	findLeft(x: number): number {
		return CardPositionService.absolutePositionToLeft(x) + Constants.VALUE.MECHANIC_INFO_WIDTH;
	}

	findTop(y: number): number {
		return y + Constants.VALUE.LINE_HEIGHT_DEFAULT/2;
	}

}
