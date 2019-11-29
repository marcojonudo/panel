import {AppointmentsCounterUpdate} from "./appointments-counter-update";
import {Constants} from "../constants";
import {Card} from "../card";
import {UtilsService} from "../../services/utils.service";

export class AppointmentsCounterUpdateSubtract implements AppointmentsCounterUpdate {

	day: Date;
	cards: Card[];

	constructor(day: Date, cards: Card[]) {
		this.day = day;
		this.cards = cards;
	}

	update(daysAppointmentsCounter: any): void {
		if (this.day) {
			this.cards.forEach((card: Card) => {
				const scheduleType = UtilsService.findScheduleType(card.lastStart, card.lastEnd);
				daysAppointmentsCounter[this.day.getTime()][card.group.appointmentType.code][`${scheduleType.toLowerCase()}`] -= 1;
			});
		}
	}

}
