import {Mechanic} from "../mechanic";
import {AppointmentsService} from "../../services/appointments.service";
import {Dayjs} from "dayjs";
import {MechanicAppointment} from "../mechanic-appointment";
import {ScheduleInterval} from "../schedule-interval";

export interface DragScheduleBehaviour {

	calcQuarterRefLeft(clientX: number, appointment: MechanicAppointment): number;

	createAppointment(
		appointment: MechanicAppointment, quarterRefLeft: number, appointmentTypeCode: string, mechanic: Mechanic
	): MechanicAppointment;

	findMovedQuarterRef(quarterRefLeft: number, movedQuarters: number, day: Dayjs): Dayjs;

	updateQuarterRef(quarterRef: Dayjs, mechanic: Mechanic, appointment: MechanicAppointment): void;

	updateDatabase(
		appointmentsService: AppointmentsService,
		mechanic: Mechanic,
		appointment: MechanicAppointment,
		interval: ScheduleInterval
	): void;

}
