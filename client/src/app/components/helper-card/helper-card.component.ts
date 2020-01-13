import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Card} from "../../objects/card";
import {Constants} from "../../objects/constants";
import {CardsService} from "../../services/cards.service";

@Component({
	selector: 'app-helper-card',
	templateUrl: './helper-card.component.html',
	styleUrls: ['./helper-card.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class HelperCardComponent {

	@Input() card: Card;

	private readonly CARD_STATE_COLOR: any;

	constructor(private cardsService: CardsService) {
		this.CARD_STATE_COLOR = {
			P: '#FF0000',
			E: '#008000',
			A: '#0CC4D6'
		};
	}

	findBackground(type: string): string {
		return Constants.CARD_TYPE_BACKGROUND[type] || Constants.CARD_TYPE_BACKGROUND['DEFAULT'];
	}

	getOrderStateColor(state: string): string {
		return this.CARD_STATE_COLOR[state];
	}

	checkShowLeftLinkHandler(card: Card): boolean {
		return this.cardsService.findLeftNextCard(card) != undefined;
	}

	checkShowRightLinkHandler(card: Card): boolean {
		return this.cardsService.findRightNextCard(card) != undefined;
	}

	check(): void {
		if (Constants.CHECK) {
			console.log('checking helper card', this.card);
		}
	}

}
