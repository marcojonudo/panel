import {MechanicAppointment} from "./mechanic-appointment";
import {ScheduleInterval} from "./schedule-interval";
import {AppointmentType} from "./appointments/appointment-type";

export class Builder {

	static buildMechanicAppointment(
		appointmentTypeCode: string, interval: ScheduleInterval, appointmentType: AppointmentType
	): MechanicAppointment {
		const mechanicAppointment = new MechanicAppointment(appointmentType);
		mechanicAppointment.appointmentTypeCode = appointmentTypeCode;
		mechanicAppointment.interval = interval;
		return mechanicAppointment;
	}

}
