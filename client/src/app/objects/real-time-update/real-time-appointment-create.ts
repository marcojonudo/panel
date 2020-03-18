import {RealTimeUpdate} from "./real-time-update";
import {RealTimeService} from "../../services/real-time.service";
import {AppointmentSchedule} from "../appointment-schedule";

export class RealTimeAppointmentCreate extends RealTimeUpdate {

	private realTimeService: RealTimeService;
	private readonly appointment: AppointmentSchedule;

	constructor(realTimeService: RealTimeService, appointment: any) {
		super();
		this.realTimeService = realTimeService;
		this.appointment = AppointmentSchedule.build(appointment);
	}

	update(): void {
		this.realTimeService.createAppointment(this.appointment);
	}

}
