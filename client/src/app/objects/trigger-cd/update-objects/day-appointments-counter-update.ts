import {Constants} from "../../constants";
import {UpdateObject} from "./update-object";
import {DaysUpdateObjects} from "../days-update-objects";
import {Dayjs} from "dayjs";
import {AppointmentsCounter} from "../../appointments-counter";
import {AppointmentsCounterUpdate} from "./appointments-counter-update";
import {AppointmentsDetailsInfo} from "../../lateral-panel-info/appointments-details-info";
import {DayAppointmentsCounter} from "../day-update/day-appointments-counter";

export class DayAppointmentsCounterUpdate implements UpdateObject {

	type: string;
	value: DayAppointmentsCounter;

	constructor(value: DayAppointmentsCounter) {
		this.type = Constants.UPDATE_OBJECT.APPOINTMENTS_COUNTER;
		this.value = value;
	}

	updateObjects(
		daysUpdateObjects: DaysUpdateObjects,
		day: Dayjs = this.value.day,
		appointmentsCounter: AppointmentsCounter = this.value.appointmentsCounter,
		type: string = this.type
	): void {
		daysUpdateObjects[day.valueOf()][type] = new AppointmentsCounterUpdate(appointmentsCounter);
		/* Se actualiza el panel lateral sólo si este está abierto */
		if (daysUpdateObjects[day.valueOf()][Constants.UPDATE_OBJECT.LATERAL_PANEL]) {
			daysUpdateObjects[day.valueOf()][Constants.UPDATE_OBJECT.LATERAL_PANEL] =
				new AppointmentsDetailsInfo(appointmentsCounter);
		}
	}

}
