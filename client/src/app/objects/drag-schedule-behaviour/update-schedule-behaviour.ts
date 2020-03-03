import {DragScheduleBehaviour} from "./drag-schedule-behaviour";
import {AppointmentSchedule} from "../appointment-schedule";
import {DimensionsService} from "../../services/dimensions.service";
import {UtilsService} from "../../services/utils.service";
import {AppointmentsService} from "../../services/appointments.service";
import {Mechanic} from "../mechanic";

export class UpdateScheduleBehaviour implements DragScheduleBehaviour {

	left: boolean;

	constructor(left: boolean) {
		this.left = left;
	}

	calcQuarterRefLeft(clientX: number, appointment: AppointmentSchedule): number {
		return DimensionsService.calcLeftFromStart(
			this.left ? appointment.schedule.start : UtilsService.addMinutes(appointment.schedule.end, 15)
		);
	}

	createAppointment(appointment: AppointmentSchedule): AppointmentSchedule {
		return appointment;
	}

	findMovedQuarterRef(
		quarterRefLeft: number,
		movedQuarters: number,
		day: Date
	): Date {
		movedQuarters = this.left ? movedQuarters : movedQuarters - 1;
		return DimensionsService.calcStartFromLeft(
			quarterRefLeft + movedQuarters * DimensionsService.intervalWidth * 3,
			day
		);
	}

	updateQuarterRef(
		quarterRef: Date,
		mechanic: Mechanic,
		appointment: AppointmentSchedule
	): void {
		if (this.left) {
			if (quarterRef.getTime() <= appointment.schedule.end.getTime()) {
				AppointmentsService.updateSchedule(
					mechanic,
					appointment,
					quarterRef,
					appointment.schedule.end
				);
			}
		} else {
			if (quarterRef.getTime() >= appointment.schedule.start.getTime()) {
				AppointmentsService.updateSchedule(
					mechanic,
					appointment,
					appointment.schedule.start,
					quarterRef
				);
			}
		}
	}

	updateDatabase(appointmentsService: AppointmentsService, appointment: AppointmentSchedule): void {
		appointmentsService.updateDb(appointment);
	}

}
