import {Card} from "./card";

export class SyncCardsInfo {

	newCards: Card[];
	updatedCards: Card[];
	deletedCards: Card[];
	triggerCd: boolean;

	constructor(newCards: Card[], updatedCards: Card[], deletedCards: Card[]) {
		this.newCards = newCards;
		this.updatedCards = updatedCards;
		this.deletedCards = deletedCards;
		this.triggerCd = this.newCards.length != 0 || this.updatedCards.length != 0 || this.deletedCards.length != 0
	}

}
