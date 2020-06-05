import {LateralPanelInfo} from "./lateral-panel-info";
import {Constants} from "../constants";
import {AppointmentsCounter} from "../appointments-counter";
import {AppointmentsCounterUpdate} from "../trigger-cd/update-objects/appointments-counter-update";

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
