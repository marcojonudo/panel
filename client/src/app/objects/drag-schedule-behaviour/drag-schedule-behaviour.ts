import {AppointmentSchedule} from "../appointment-schedule";
import {Mechanic} from "../mechanic";
import {AppointmentsService} from "../../services/appointments.service";

export interface DragScheduleBehaviour {

	calcQuarterRefLeft(clientX: number, appointment: AppointmentSchedule): number;

	updateQuarterRef(
		quarterRefLeft: number,
		movedQuarters: number,
		mechanic: Mechanic,
		appointment: AppointmentSchedule
	): void;

	updateDatabase(appointmentsService: AppointmentsService, appointment: AppointmentSchedule): void;

}
