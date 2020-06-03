import {Constants} from "../../constants";
import {UpdateObject} from "./update-object";
import {AppointmentsCounter} from "../../appointments-counter";

export class AppointmentsCounterUpdate implements UpdateObject {

	type: string;
	value: AppointmentsCounter;

	constructor(value: AppointmentsCounter) {
		this.type = Constants.TRIGGER_CD_UPDATE_PROPERTY.APPOINTMENTS_COUNTER;
		this.value = value;
	}

	updateObjects(): void {}

}
