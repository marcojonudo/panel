import {
	ChangeDetectionStrategy,
	Component,
	Input,
} from '@angular/core';
import {Card} from "../../objects/card";
import {Constants} from "../../objects/constants";
import {CardsService} from "../../services/cards.service";

@Component({
	selector: 'app-card',
	templateUrl: './card.component.html',
	styleUrls: ['./card.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent {

	@Input() card: Card;
	@Input() width: number;
	@Input() possibleLinkedNext: boolean;
	@Input() possibleLinkedPrevious: boolean;

	private readonly CARD_STATE_COLOR: any;

	constructor(
		private cardsService: CardsService
	) {
		this.CARD_STATE_COLOR = {
			P: '#FF0000',
			E: '#008000',
			A: '#0CC4D6'
		};
	}

	getOrderStateColor(state: string): string {
		return this.CARD_STATE_COLOR[state];
	}

	// region Link handlers

	checkShowLeftLinkHandler(card: Card): boolean {
		return this.cardsService.findLeftNextCard(card) != undefined;
	}

	checkShowRightLinkHandler(card: Card): boolean {
		return this.cardsService.findRightNextCard(card) != undefined;
	}

	handleLinkPrevious(card: Card): void {
		card.linkedPrevious ?
			this.cardsService.unlink(card, Constants.NEXT_CARD_DIRECTION.LEFT) : this.cardsService.linkPrevious(card);
	}

	handleLinkNext(card: Card): void {
		card.linkedNext ?
			this.cardsService.unlink(card, Constants.NEXT_CARD_DIRECTION.RIGHT) : this.cardsService.linkNext(card);
	}

	// endregion

	check() {
		if (Constants.CHECK) {
			console.log('checking card', this.card, this.possibleLinkedNext);
		}
	}

}
