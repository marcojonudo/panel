import {Card} from "../card";

export class UpdateDurationInfo {

	cards: Card[];
	dragWhenReducing: boolean;

	constructor(cards: Card[] = [], dragWhenReducing: boolean = false) {
		this.cards = cards;
		this.dragWhenReducing = dragWhenReducing;
	}

}
