import {LateralPanelInfo} from "./lateral-panel-info";
import {Constants} from "../constants";
import {DayAppointmentsCounter} from "../day-appointments-counter";

export class AppointmentsDetailsInfo implements LateralPanelInfo {

	type: string;
	params: DayAppointmentsCounter;
	show: boolean;

	constructor(dayAppointmentsCounter: DayAppointmentsCounter) {
		this.type = Constants.LATERAL_PANEL_INFO_TYPE.APPOINTMENTS_DETAILS;
		this.params = dayAppointmentsCounter;
		this.show = dayAppointmentsCounter != undefined;
	}

	handle(): void {}

}
