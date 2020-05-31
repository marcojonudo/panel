import {
	ChangeDetectionStrategy,
	Component,
	Input,
} from '@angular/core';
import {Card} from "../../objects/card";
import {Constants} from "../../objects/constants";
import {CardsService} from "../../services/cards.service";
import {UnassignedCardLinkHandler} from "../../objects/card-links/unassigned-card-link-handler";
import {AssignedCardLinkHandler} from "../../objects/card-links/assigned-card-link-handler";
import {Dayjs} from "dayjs";
import {NotificationService} from "../../services/notification.service";

@Component({
	selector: 'app-card',
	templateUrl: './card.component.html',
	styleUrls: ['./card.component.css']
})
export class CardComponent {

	@Input() card: Card;
	@Input() width: number;

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

	findBackground(type: string): string {
		return Constants.CARD_TYPE_BACKGROUND[type] || Constants.CARD_TYPE_BACKGROUND['DEFAULT'];
	}

	findBorder(highlight: boolean): string {
		return highlight ? `2px solid red` : undefined;
	}


	findBottomSectionBackground(divisionIndex: number, color: string) {
		return divisionIndex == 0 ? color : `repeating-linear-gradient(45deg, ${color}, ${color} 4px, #fff 4px, #fff 8px)`
	}

	highlightOrderCards(day: Dayjs, orderNumber: number, highlight: boolean) {
		/* Se resaltan las fichas sólo si se pasa el ratón por encima de una asignada (tiene day) */
		if (day) {
			// const orderGroups = CardsService.findOrderGroups(CardsService.assignedCardsGroups, orderNumber);
			// orderGroups.forEach((group: CardsGroup) => {
			// 	group.cards.forEach((card: Card) => {
			// 		card.highlight = true;
			// 	})
			// });
			// const orderCards = CardsService.findOrderCards(orderNumber).filter((card: Card) => {
			// 	return !card.day.isSame(day) || card.mechanicCode != mechanicCode
			// });
			CardsService.findOrderCards(orderNumber).forEach((card: Card) => {
				card.highlight = highlight;
			});
			NotificationService.notifyMechanicLine(
				Constants.MECHANIC_LINE_UPDATE_TYPE.HIGHLIGHT_CARDS,
				undefined,
				undefined
			);
		}
	}

	// region Link handlers

	checkShowLeftLinkHandler(card: Card): boolean {
		return CardsService.findLeftNextCard(card) != undefined;
	}

	checkShowRightLinkHandler(card: Card): boolean {
		return CardsService.findRightNextCard(card) != undefined;
	}

	findLinkImage(linkedCard: Card): string {
		return linkedCard ? Constants.LINK_HANDLER_IMAGE.JOINED : Constants.LINK_HANDLER_IMAGE.SPLITTED;
	}

	handlePreviousLink(card: Card): void {
		const linkHandler = card.day
			? new AssignedCardLinkHandler() : new UnassignedCardLinkHandler();
		const cardsToUpdate = card.linkedPrevious
			? CardsService.unlink(card, Constants.NEXT_CARD_DIRECTION.LEFT, linkHandler)
			: CardsService.linkPrevious(card, linkHandler);
		this.cardsService.updateDbCardsLinks(cardsToUpdate);
	}

	handleNextLink(card: Card): void {
		const linkHandler = card.day
			? new AssignedCardLinkHandler() : new UnassignedCardLinkHandler();
		const cardsToUpdate = card.linkedNext
			? CardsService.unlink(card, Constants.NEXT_CARD_DIRECTION.RIGHT, linkHandler)
			: CardsService.linkNext(card, linkHandler);
		this.cardsService.updateDbCardsLinks(cardsToUpdate)
	}

	// endregion

	check() {
		if (Constants.CHECK) {
			console.log('checking card', this.card, this.card.linkedPrevious, this.card.linkedNext);
		}
	}

}
