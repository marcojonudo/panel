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

	getOrderStateColor(state: string): string {
		return this.CARD_STATE_COLOR[state];
	}

	checkShowLeftLinkHandler(card: Card, direction: string = Constants.NEXT_CARD_DIRECTION.LEFT): boolean {
		return this.cardsService.findLeftNextCard(card, direction) != undefined;
	}

	checkShowRightLinkHandler(card: Card, direction: string = Constants.NEXT_CARD_DIRECTION.RIGHT): boolean {
		return this.cardsService.findRightNextCard(card, direction) != undefined;
	}

	check(): void {
		if (Constants.CHECK) {
			console.log('checking helper card', this.card);
		}
	}

}
