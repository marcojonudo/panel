import {Constants} from "../constants";
import {LateralPanelInfo} from "./lateral-panel-info";
import {AppointmentDayUpdate} from "../trigger-cd/update-objects/appointments-counter/appointment-day-update";
import {AppointmentDay} from "../appointments/appointment-day";

export class AppointmentsDetailsInfo implements LateralPanelInfo {

	type: string;
	params: AppointmentDayUpdate;
	show: boolean;

	constructor(appointmentDay: AppointmentDay) {
		this.type = Constants.LATERAL_PANEL_INFO_TYPE.APPOINTMENTS_DETAILS;
		console.log(3333);
		this.params = new AppointmentDayUpdate(appointmentDay);
		this.show = appointmentDay != undefined;
	}

}
