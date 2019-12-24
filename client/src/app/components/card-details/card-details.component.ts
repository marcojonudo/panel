import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Card} from "../../objects/card";
import {Constants} from "../../objects/constants";

@Component({
	selector: 'app-card-details',
	templateUrl: './card-details.component.html',
	styleUrls: ['./card-details.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardDetailsComponent {

	@Input() card: Card;

	// region Getters / setters

	get cardDetailsWidth(): number {
		return Constants.VALUE.CARD_DETAILS_PANEL_WIDTH;
	}

	// endregion

	findStateName(state: string): string {
		return Constants.ORDER_STATE_NAME[state];
	}

	check(): void {
		if (Constants.CHECK) {
			console.log('Checking app card details', this.card);
		}
	}

}
