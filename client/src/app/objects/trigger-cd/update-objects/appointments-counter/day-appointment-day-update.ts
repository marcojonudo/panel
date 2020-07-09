import {Dayjs} from "dayjs";
import {AppointmentDayUpdate} from "./appointment-day-update";
import {Constants} from "../../../constants";
import {AppointmentsDetailsInfo} from "../../../lateral-panel-info/appointments-details-info";
import {DayTriggerMapUpdate} from "../trigger-map-update/day-trigger-map-update";
import {DaysTriggerMap} from "../../trigger-maps/days-trigger-map";
import {AppointmentDay} from "../../../appointments/appointment-day";

export class DayAppointmentDayUpdate implements DayTriggerMapUpdate {

	type: string;
	day: Dayjs;
	value: AppointmentDay;

	constructor(day: Dayjs, value: AppointmentDay) {
		this.type = Constants.UPDATE_OBJECT.APPOINTMENT_DAY;
		this.day = day;
		this.value = value;
	}

	updateTriggerMap(
		daysUpdateObjects: DaysTriggerMap,
		day: Dayjs = this.day,
		type: string = this.type,
		appointmentDay: AppointmentDay = this.value
	): void {
		daysUpdateObjects[day.valueOf()][type] = new AppointmentDayUpdate(appointmentDay);
		/* Se actualiza el panel lateral sólo si este está abierto */
		if (daysUpdateObjects[day.valueOf()][Constants.UPDATE_OBJECT.LATERAL_PANEL]) {
			daysUpdateObjects[day.valueOf()][Constants.UPDATE_OBJECT.LATERAL_PANEL] =
				new AppointmentsDetailsInfo(appointmentDay);
		}
	}

}
