import {Dayjs} from "dayjs";
import {AppointmentsCounter} from "../../appointments-counter";

export class DayAppointmentsCounter {

	day: Dayjs;
	appointmentsCounter: AppointmentsCounter;

	constructor(day: Dayjs, appointmentsCounter: AppointmentsCounter) {
		this.day = day;
		this.appointmentsCounter = appointmentsCounter;
	}

}
