import {Card} from "../card";

export interface AppointmentsCounterUpdate {

	day: Date;
	cards: Card[];

	update(daysAppointmentsCounter: any): void;

}
