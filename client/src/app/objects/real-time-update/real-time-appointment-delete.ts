import {RealTimeUpdate} from "./real-time-update";
import {RealTimeService} from "../../services/real-time.service";
import {AppointmentSchedule} from "../appointment-schedule";
import * as dayjs from "dayjs";
import {AppointmentsService} from "../../services/appointments.service";
import {ScheduleInterval} from "../schedule-interval";
import {UtilsService} from "../../services/utils.service";
import {Constants} from "../constants";

export class RealTimeAppointmentDelete extends RealTimeUpdate {

	private readonly appointment: AppointmentSchedule;

	constructor(appointment: any) {
		super();
		const day = dayjs(appointment.day);
		const start = UtilsService.parseTime(appointment.start, day);
		/* Sólo se define el start, porque esta información sólo sirve para identificar la cita que se va a eliminar.
		*  Por lo tanto, se añaden 5 min para definir el end sólo para que no falle la inicialización del objeto */
		this.appointment = new AppointmentSchedule(
			day,
			appointment.mechanicCode,
			AppointmentsService.findAppointmentType(appointment.typeCode),
			new ScheduleInterval(start, start.add(5, Constants.DAY_JS.m))
		);
	}

	update(): void {
		RealTimeService.deleteAppointment(this.appointment);
	}

}
