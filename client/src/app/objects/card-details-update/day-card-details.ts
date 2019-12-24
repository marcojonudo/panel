import {Card} from "../card";

export class DayCardDetails {

	day: Date;
	card: Card;

	constructor(day: Date = undefined, card: Card = undefined) {
		this.day = day;
		this.card = card;
	}

}
