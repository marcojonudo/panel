import {RealTimeUpdate} from "./real-time-update";
import {RealTimeService} from "../../services/real-time.service";
import {AppointmentSchedule} from "../appointment-schedule";

export class RealTimeAppointmentUpdateType extends RealTimeUpdate {

	private readonly appointment: AppointmentSchedule;

	constructor(appointment: any) {
		super();
		this.appointment = new AppointmentSchedule(
			parseInt(appointment.mechanicId),
			parseInt(appointment.index),
			appointment
		);
	}

	update(realTimeService: RealTimeService): void {
		realTimeService.updateAppointmentType(this.appointment);
	}

}
