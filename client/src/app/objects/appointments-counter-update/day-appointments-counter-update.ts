import {Dayjs} from "dayjs";

export class DayAppointmentsCounterUpdate {

	day: Dayjs;

	constructor(day: Dayjs) {
		this.day = day;
	}

}
