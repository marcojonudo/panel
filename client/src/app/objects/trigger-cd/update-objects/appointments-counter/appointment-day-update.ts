import {Constants} from "../../../constants";
import {TriggerMapUpdate} from "../trigger-map-update/trigger-map-update";
import {AppointmentDay} from "../../../appointments/appointment-day";

export class AppointmentDayUpdate implements TriggerMapUpdate {

	type: string;
	value: AppointmentDay;

	constructor(value: AppointmentDay) {
		this.type = Constants.UPDATE_OBJECT.APPOINTMENT_DAY;
		this.value = value;
	}

	updateObjects(): void {}

}
