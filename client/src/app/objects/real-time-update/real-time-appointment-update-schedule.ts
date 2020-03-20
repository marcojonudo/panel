import {RealTimeUpdate} from "./real-time-update";
import {RealTimeService} from "../../services/real-time.service";
import {AppointmentSchedule} from "../appointment-schedule";

export class RealTimeAppointmentUpdateSchedule extends RealTimeUpdate {

	private readonly appointment: AppointmentSchedule;

	constructor(appointment: any) {
		super();
		this.appointment = AppointmentSchedule.build(appointment);
	}

	update(): void {
		RealTimeService.updateAppointmentSchedule(this.appointment);
	}

}
