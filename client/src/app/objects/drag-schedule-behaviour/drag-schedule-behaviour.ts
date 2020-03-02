import {AppointmentSchedule} from "../appointment-schedule";
import {Mechanic} from "../mechanic";

export interface DragScheduleBehaviour {

	calcQuarterRefLeft(clientX: number, appointment: AppointmentSchedule): number;

	updateQuarterRef(
		quarterRefLeft: number,
		movedQuarters: number,
		mechanic: Mechanic,
		appointment: AppointmentSchedule
	): void;

}
