import {AppointmentSchedule} from "../appointment-schedule";
import {Mechanic} from "../mechanic";
import {AppointmentsService} from "../../services/appointments.service";

export interface DragScheduleBehaviour {

	calcQuarterRefLeft(clientX: number, appointment: AppointmentSchedule): number;

	createAppointment(
		appointment: AppointmentSchedule,
		quarterRefLeft: number,
		appointmentTypeCode: string,
		mechanic: Mechanic
	): AppointmentSchedule;

	findMovedQuarterRef(quarterRefLeft: number, movedQuarters: number, day: Date): Date;

	updateQuarterRef(
		quarterRef: Date,
		mechanic: Mechanic,
		appointment: AppointmentSchedule
	): void;

	updateDatabase(appointmentsService: AppointmentsService, appointment: AppointmentSchedule): void;

}
