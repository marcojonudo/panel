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

	private readonly CARD_STATE_COLOR: any;

	constructor(
		private cardsService: CardsService,
	) {
		this.CARD_STATE_COLOR = {
			P: '#FF0000',
			E: '#008000',
			A: '#0CC4D6'
		}
	}

	getOrderStateColor(state: string): string {
		return this.CARD_STATE_COLOR[state];
	}

	// region Link handlers

	checkShowLeftLinkHandler(card: Card, direction: string = Constants.NEXT_CARD_DIRECTION.LEFT): boolean {
		const leftCard = card.start ?
			this.cardsService.getLeftAssignedNextCard(card.day, card.mechanicCode, card.line, card.start) :
			this.cardsService.findUnassignedNextCard(card.id, direction);
		return leftCard != undefined;
	}

	checkShowRightLinkHandler(card: Card, direction: string = Constants.NEXT_CARD_DIRECTION.RIGHT): boolean {
		const rightCard = card.start ?
			this.cardsService.getRightAssignedNextCard(card.day, card.mechanicCode, card.line, card.end) :
			this.cardsService.findUnassignedNextCard(card.id, direction);
		return rightCard != undefined;
	}

	// endregion



	linkPrevious(card: Card, previousId: number): void {
		console.log('LINK PREVIOUS ID');
		if (previousId) {
			card.linkedPreviousId = undefined;
			const previousCard = this.cardsService.getLinkedPreviousCard(card.day, card.mechanicCode, previousId);
			console.log(previousCard);
		}
	}

	check() {
		if (Constants.CHECK) {
			console.log('checking card', this.card, this.card.width);
		}
	}

}
