import {ScheduleInterval} from "./schedule-interval";
import * as dayjs from "dayjs";
import {Constants} from "./constants";
import {Dayjs} from "dayjs";
import {AppointmentType} from "./appointments/appointment-type";

export class MechanicAppointment {

	appointmentTypeCode: string;
	interval: ScheduleInterval;
	appointmentType: AppointmentType;

	constructor(appointmentType: AppointmentType, mechanicAppointment: any = undefined, day: Dayjs = undefined) {
		this.appointmentType = appointmentType;
		/* Se reciben parámetros cuando se construye el objeto a partir del JSON. Cuando se hace en el appointments
		 * service, se crea la instancia vacía para poder asignar directamente los campos convertidos */
		if (mechanicAppointment) {
			this.appointmentTypeCode = mechanicAppointment.appointmentTypeCode;
			this.interval = new ScheduleInterval(
				dayjs(
					`${day.format(Constants.DATE_FORMAT.yyyy_MM_dd)} ${mechanicAppointment.interval.start}`,
					Constants.DATE_TIME_FORMAT.yyyy_MM_dd_HH_mm
				),
				dayjs(
					`${day.format(Constants.DATE_FORMAT.yyyy_MM_dd)} ${mechanicAppointment.interval.end}`,
					Constants.DATE_TIME_FORMAT.yyyy_MM_dd_HH_mm
				)
			)
		}
	}

	equals(appointment: MechanicAppointment): boolean {
		return this.appointmentTypeCode == appointment.appointmentTypeCode &&
			this.interval.equals(appointment.interval);
	}

}
