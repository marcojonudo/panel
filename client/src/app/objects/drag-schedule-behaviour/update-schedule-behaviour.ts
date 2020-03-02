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

	updateQuarterRef(
		quarterRefLeft: number,
		movedQuarters: number,
		mechanic: Mechanic,
		appointment: AppointmentSchedule
	): void {
		movedQuarters = this.left ? movedQuarters : movedQuarters - 1;
		const quarterRef = DimensionsService.calcStartFromLeft(
			quarterRefLeft + movedQuarters * DimensionsService.intervalWidth * 3,
			mechanic.day
		);
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
