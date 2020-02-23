import {RealTimeUpdate} from "./real-time-update";
import {RealTimeService} from "../../services/real-time.service";
import {AppointmentSchedule} from "../appointment-schedule";

export class RealTimeAppointmentUpdateType extends RealTimeUpdate {

	private readonly appointment: AppointmentSchedule;

	constructor(appointment: any) {
		super();
		let start, end;
		if (appointment.schedule.morningStart) {
			start = appointment.schedule.morningStart;
			end = appointment.schedule.morningEnd;
		} else {
			start = appointment.schedule.afternoonStart;
			end = appointment.schedule.afternoonEnd;
		}
		// this.appointment = new AppointmentSchedule(undefined, appointment.appointmentType, start, end);
	}

	update(realTimeService: RealTimeService): void {
		realTimeService.updateAppointmentType(this.appointment);
	}

}
