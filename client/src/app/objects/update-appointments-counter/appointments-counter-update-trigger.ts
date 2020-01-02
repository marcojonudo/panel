import {AppointmentsCounterUpdate} from "./appointments-counter-update";
import {Card} from "../card";

export class AppointmentsCounterUpdateTrigger implements AppointmentsCounterUpdate {

	day: Date;
	cards: Card[];

	constructor(day: Date, cards: Card[]) {
		this.day = day;
		this.cards = cards;
	}

	update(daysAppointmentsCounter: any): void {}

}
