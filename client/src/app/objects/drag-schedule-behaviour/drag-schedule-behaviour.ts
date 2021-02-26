import {AppointmentSchedule} from "../appointment-schedule";
import {Mechanic} from "../mechanic";
import {AppointmentsService} from "../../services/appointments.service";
import {Dayjs} from "dayjs";

export interface DragScheduleBehaviour {

	calcQuarterRefLeft(clientX: number, appointment: AppointmentSchedule): number;

	createAppointment(
		appointment: AppointmentSchedule,
		quarterRefLeft: number,
		appointmentTypeCode: string,
		mechanic: Mechanic
	): AppointmentSchedule;

	findMovedQuarterRef(quarterRefLeft: number, movedQuarters: number, day: Dayjs): Dayjs;

	updateQuarterRef(
		quarterRef: Dayjs,
		mechanic: Mechanic,
		appointment: AppointmentSchedule
	): void;

	updateDatabase(appointmentsService: AppointmentsService, appointment: AppointmentSchedule): void;

}
