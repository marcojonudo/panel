import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Card} from "../../objects/card";
import {Constants} from "../../objects/constants";
import {NotificationService} from "../../services/notification.service";
import {DayLateralPanelInfo} from "../../objects/lateral-panel-info/day-lateral-panel-info";

@Component({
	selector: 'app-card-details',
	templateUrl: './card-details.component.html',
	styleUrls: ['./card-details.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardDetailsComponent {

	@Input() card: Card;

	findStateName(state: string): string {
		return Constants.ORDER_STATE_NAME[state];
	}

	closePanel(): void {
		NotificationService.notifyLateralInfo(new DayLateralPanelInfo(this.card.day, undefined));
	}

	check(): void {
		if (Constants.CHECK) {
			console.log('Checking app card details', this.card);
		}
	}

}
