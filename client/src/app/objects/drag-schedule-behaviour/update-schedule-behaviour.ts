import {DragScheduleBehaviour} from "./drag-schedule-behaviour";
import {AppointmentSchedule} from "../appointment-schedule";
import {DimensionsService} from "../../services/dimensions.service";
import {UtilsService} from "../../services/utils.service";
import {AppointmentsService} from "../../services/appointments.service";
import {Mechanic} from "../mechanic";
import {Dayjs} from "dayjs";
import {Constants} from "../constants";

export class UpdateScheduleBehaviour implements DragScheduleBehaviour {

	left: boolean;

	constructor(left: boolean) {
		this.left = left;
	}

	calcQuarterRefLeft(clientX: number, appointment: AppointmentSchedule): number {
		return DimensionsService.calcLeftFromStart(
			this.left
				? appointment.schedule.start
				: appointment.schedule.end.add(Constants.QUARTERS.STEP_15, Constants.DAY_JS.m)
		);
	}

	createAppointment(appointment: AppointmentSchedule): AppointmentSchedule {
		return appointment;
	}

	findMovedQuarterRef(
		quarterRefLeft: number,
		movedQuarters: number,
		day: Dayjs
	): Dayjs {
		movedQuarters = this.left ? movedQuarters : movedQuarters - 1;
		return DimensionsService.calcStartFromLeft(
			quarterRefLeft + movedQuarters * DimensionsService.intervalWidth * 3,
			day
		);
	}

	updateQuarterRef(
		quarterRef: Dayjs,
		mechanic: Mechanic,
		appointment: AppointmentSchedule
	): void {
		if (this.left) {
			if (quarterRef.valueOf() <= appointment.schedule.end.valueOf()) {
				AppointmentsService.updateSchedule(
					mechanic,
					appointment,
					quarterRef,
					appointment.schedule.end
				);
			}
		} else {
			if (quarterRef.valueOf() >= appointment.schedule.start.valueOf()) {
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
