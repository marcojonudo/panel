import {TriggerMap} from "./trigger-map";
import {DayTriggerTypes} from "./day-trigger-types";
import {Dayjs} from "dayjs";
import {CardsService} from "../../../services/cards.service";
import {AppointmentsService} from "../../../services/appointments.service";

export class DaysTriggerMap implements TriggerMap {

	[key: number]: DayTriggerTypes;

	constructor(days: Dayjs[], appointmentsService: AppointmentsService) {
		days.forEach((day: Dayjs) => {
			this[day.valueOf()] = new DayTriggerTypes(
				CardsService.buildDaySaturation(day),
				appointmentsService.findAppointmentDay(day)
			);
		});
	}

}
