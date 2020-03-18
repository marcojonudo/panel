import {RealTimeUpdate} from "./real-time-update";
import {RealTimeService} from "../../services/real-time.service";
import {AppointmentSchedule} from "../appointment-schedule";

export class RealTimeAppointmentUpdateType extends RealTimeUpdate {

	private realTimeService: RealTimeService;
	private readonly appointment: AppointmentSchedule;

	constructor(realTimeService: RealTimeService, appointment: any) {
		super();
		this.realTimeService = realTimeService
		// this.appointment = new AppointmentSchedule(undefined, appointment.appointmentType, start, end);
	}

	update(): void {
		// this.realTimeService.updateAppointmentType(this.appointment);
	}

}
