import {Card} from "./card";
import {AppointmentDay} from "./appointments/appointment-day";

export class SyncCardsInfo {

	newCards: Card[];
	newReplace: Card[];
	reset: Card[]
	updated: Card[];
	deleted: Card[];
	appointmentDays: AppointmentDay[];

	constructor(syncInfo: any) {
		this.newCards = syncInfo.newCards.map(card => new Card(card));
		this.newReplace = syncInfo.newReplace.map(card => new Card(card));
		this.reset = syncInfo.reset.map(card => new Card(card));
		this.updated = syncInfo.updated.map(card => new Card(card));
		this.deleted = syncInfo.deleted.map(card => new Card(card));
		this.appointmentDays = syncInfo.appointmentDays.map(appointmentDay => new AppointmentDay(appointmentDay));
	}

}
