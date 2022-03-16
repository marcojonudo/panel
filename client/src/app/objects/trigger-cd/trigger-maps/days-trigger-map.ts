import {TriggerMap} from "./trigger-map";
import {DayTriggerTypes} from "./day-trigger-types";
import {Dayjs} from "dayjs";
import {CardsService} from "../../../services/cards.service";
import {AppointmentsService} from "../../../services/appointments.service";

export class DaysTriggerMap implements TriggerMap {

	[key: number]: DayTriggerTypes;

	constructor(days: Dayjs[]) {
		days.forEach((day: Dayjs) => {
			const appointmentDay = AppointmentsService.findAppointmentDay(day);
			this[day.valueOf()] = new DayTriggerTypes(
				CardsService.buildDaySaturation(day), appointmentDay
			);
		});
	}

}
