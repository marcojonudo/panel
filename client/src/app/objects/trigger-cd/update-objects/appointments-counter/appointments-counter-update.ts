import {AppointmentsCounter} from "../../../appointments-counter";
import {Constants} from "../../../constants";
import {TriggerMapUpdate} from "../trigger-map-update/trigger-map-update";

export class AppointmentsCounterUpdate implements TriggerMapUpdate {

	type: string;
	value: AppointmentsCounter;

	constructor(value: AppointmentsCounter) {
		this.type = Constants.UPDATE_OBJECT.APPOINTMENTS_COUNTER;
		this.value = value;
	}

	updateObjects(): void {}

}
