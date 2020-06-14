import {Dayjs} from "dayjs";
import {AppointmentsCounterUpdate} from "./appointments-counter-update";
import {AppointmentsCounter} from "../../../appointments-counter";
import {Constants} from "../../../constants";
import {AppointmentsDetailsInfo} from "../../../lateral-panel-info/appointments-details-info";
import {DayTriggerMapUpdate} from "../trigger-map-update/day-trigger-map-update";
import {DaysTriggerMap} from "../../trigger-maps/days-trigger-map";

export class DayAppointmentsCounterUpdate implements DayTriggerMapUpdate {

	type: string;
	day: Dayjs;
	value: AppointmentsCounter;

	constructor(day: Dayjs, value: AppointmentsCounter) {
		this.type = Constants.UPDATE_OBJECT.APPOINTMENTS_COUNTER;
		this.day = day;
		this.value = value;
	}

	updateTriggerMap(
		daysUpdateObjects: DaysTriggerMap,
		day: Dayjs = this.day,
		type: string = this.type,
		appointmentsCounter: AppointmentsCounter = this.value
	): void {
		daysUpdateObjects[day.valueOf()][type] = new AppointmentsCounterUpdate(appointmentsCounter);
		/* Se actualiza el panel lateral sólo si este está abierto */
		if (daysUpdateObjects[day.valueOf()][Constants.UPDATE_OBJECT.LATERAL_PANEL]) {
			daysUpdateObjects[day.valueOf()][Constants.UPDATE_OBJECT.LATERAL_PANEL] =
				new AppointmentsDetailsInfo(appointmentsCounter);
		}
	}

}
