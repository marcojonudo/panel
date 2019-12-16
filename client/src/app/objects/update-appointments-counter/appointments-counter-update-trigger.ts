import {AppointmentsCounterUpdate} from "./appointments-counter-update";
import {Card} from "../card";
import {UtilsService} from "../../services/utils.service";

export class AppointmentsCounterUpdateTrigger implements AppointmentsCounterUpdate {

	day: Date;
	cards: Card[];

	constructor(day: Date, cards: Card[]) {
		this.day = day;
		this.cards = cards;
	}

	update(daysAppointmentsCounter: any): void {}

}
