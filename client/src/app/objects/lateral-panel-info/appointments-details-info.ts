import {Constants} from "../constants";
import {LateralPanelInfo} from "./lateral-panel-info";
import {AppointmentsCounter} from "../appointments-counter";
import {AppointmentsCounterUpdate} from "../trigger-cd/update-objects/appointments-counter/appointments-counter-update";

export class AppointmentsDetailsInfo implements LateralPanelInfo {

	type: string;
	params: AppointmentsCounterUpdate;
	show: boolean;

	constructor(appointmentsCounter: AppointmentsCounter) {
		this.type = Constants.LATERAL_PANEL_INFO_TYPE.APPOINTMENTS_DETAILS;
		this.params = new AppointmentsCounterUpdate(appointmentsCounter);
		this.show = appointmentsCounter != undefined;
	}

}
