import {DragScheduleBehaviour} from "./drag-schedule-behaviour";
import {DimensionsService} from "../../services/dimensions.service";
import {AppointmentsService} from "../../services/appointments.service";
import {Mechanic} from "../mechanic";
import {Dayjs} from "dayjs";
import {MechanicAppointment} from "../mechanic-appointment";
import {ScheduleInterval} from "../schedule-interval";

export class UpdateScheduleBehaviour implements DragScheduleBehaviour {

	left: boolean;

	constructor(left: boolean) {
		this.left = left;
	}

	calcQuarterRefLeft(clientX: number, appointment: MechanicAppointment): number {
		return DimensionsService.calcLeftFromStart(
			this.left ? appointment.interval.start : appointment.interval.end
		);
	}

	createAppointment(appointment: MechanicAppointment): MechanicAppointment {
		return appointment;
	}

	findMovedQuarterRef(quarterRefLeft: number, movedQuarters: number, day: Dayjs): Dayjs {
		movedQuarters = this.left ? movedQuarters : movedQuarters - 1;
		return DimensionsService.calcStartFromLeft(
			quarterRefLeft + movedQuarters * DimensionsService.quarterWidth, day
		);
	}

	updateQuarterRef(quarterRef: Dayjs, mechanic: Mechanic, appointment: MechanicAppointment): void {
		if (this.left) {
			if (quarterRef.valueOf() <= appointment.interval.end.valueOf()) {
				AppointmentsService.updateMechanicAppointment(mechanic, appointment, quarterRef, appointment.interval.end);
			}
		} else {
			if (quarterRef.valueOf() >= appointment.interval.start.valueOf()) {
				AppointmentsService.updateMechanicAppointment(mechanic, appointment, appointment.interval.start, quarterRef);
			}
		}
	}

	updateDatabase(
		appointmentsService: AppointmentsService,
		mechanic: Mechanic,
		appointment: MechanicAppointment,
		interval: ScheduleInterval
	): void {
		appointmentsService.updateDb(mechanic, appointment, interval);
	}

}
