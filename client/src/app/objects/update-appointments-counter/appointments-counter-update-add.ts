import {AppointmentsCounterUpdate} from "./appointments-counter-update";
import {Constants} from "../constants";
import {Card} from "../card";
import {UtilsService} from "../../services/utils.service";

export class AppointmentsCounterUpdateAdd implements AppointmentsCounterUpdate {

	day: Date;
	cards: Card[];

	constructor(day: Date, cards: Card[]) {
		this.day = day;
		this.cards = cards;
	}

	update(daysAppointmentsCounter: any): void {
		if (this.day) {
			this.cards.forEach((card: Card) => {
				const scheduleType = UtilsService.findScheduleType(card.start, card.end);
				daysAppointmentsCounter[this.day.getTime()][card.group.appointmentType.code][scheduleType] += 1;
				daysAppointmentsCounter[this.day.getTime()][card.group.appointmentType.code][Constants.APPOINTMENT_TOTAL] += 1;
			});
		}
	}

}
