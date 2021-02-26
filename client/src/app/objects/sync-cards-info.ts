import {Card} from "./card";
import {AppointmentDay} from "./appointments/appointment-day";

export class SyncCardsInfo {

	newCards: Card[];
	newReplace: Card[];
	reset: Card[]
	updated: Card[];
	deleted: Card[];
	appointmentDays: AppointmentDay[];

	constructor(
		newCards: Card[],
		newReplace: Card[],
		reset: Card[],
		updated: Card[],
		deleted: Card[],
		appointmentDays: AppointmentDay[]
	) {
		this.newCards = newCards;
		this.newReplace = newReplace;
		this.reset = reset;
		this.updated = updated;
		this.deleted = deleted;
		this.appointmentDays = appointmentDays;
	}

}
