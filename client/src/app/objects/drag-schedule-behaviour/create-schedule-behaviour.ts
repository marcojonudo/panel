import {DragScheduleBehaviour} from "./drag-schedule-behaviour";
import {CardPositionService} from "../../services/card-position.service";
import {DimensionsService} from "../../services/dimensions.service";
import {AppointmentsService} from "../../services/appointments.service";
import {UtilsService} from "../../services/utils.service";
import {AppointmentSchedule} from "../appointment-schedule";
import {Mechanic} from "../mechanic";
import {DragSchedulesService} from "../../services/drag-schedules.service";

export class CreateScheduleBehaviour implements DragScheduleBehaviour {

	calcQuarterRefLeft(clientX: number): number {
		return UtilsService.roundFloor(
			CardPositionService.absolutePositionToLeft(clientX),
			DimensionsService.intervalWidth * 3
		)
	}

	createAppointment(
		appointment: AppointmentSchedule,
		quarterRefLeft: number,
		appointmentTypeCode: string,
		mechanic: Mechanic
	): AppointmentSchedule {
		const createSchedule = this.checkCreateSchedule(quarterRefLeft, mechanic);
		let appointmentSchedule = undefined;

		if (createSchedule) {
			const quarterEndLeft = DragSchedulesService.calcQuarterEndLeft(quarterRefLeft);
			const [quarterStart, quarterEnd] =
				DragSchedulesService.calcQuarterThresholdsStart(
					quarterRefLeft,
					quarterEndLeft,
					mechanic.day
				);
			appointmentSchedule = AppointmentsService.create(
				mechanic,
				AppointmentsService.findAppointmentType(appointmentTypeCode),
				quarterStart,
				quarterEnd
			);
		}
		return appointmentSchedule;
	}

	private checkCreateSchedule(quarterRefLeft: number, mechanic: Mechanic): boolean {
		const quarterRef = DimensionsService.calcStartFromLeft(quarterRefLeft, mechanic.day);
		const nextAppointment = mechanic.appointments.find((appointment: AppointmentSchedule) => {
			const startDiff = UtilsService.findDiff(appointment.schedule.start, quarterRef);
			if (startDiff < 15) {
				return false;
			}
			const endDiff = UtilsService.findDiff(appointment.schedule.end, quarterRef);
			return endDiff < 15;
		});
		return nextAppointment == undefined;
	}

	findMovedQuarterRef(
		quarterRefLeft: number,
		movedQuarters: number,
		day: Date
	): Date {
		return DimensionsService.calcStartFromLeft(
			quarterRefLeft + movedQuarters * DimensionsService.intervalWidth * 3,
			day
		);
	}

	updateQuarterRef(
		quarterEnd: Date,
		mechanic: Mechanic,
		appointment: AppointmentSchedule
	): void {
		if (quarterEnd.getTime() >= appointment.schedule.start.getTime()) {
			AppointmentsService.updateSchedule(
				mechanic,
				appointment,
				appointment.schedule.start,
				quarterEnd
			);
		}
	}

	updateDatabase(appointmentsService: AppointmentsService, appointment: AppointmentSchedule): void {
		appointmentsService.createDb(appointment);
	}

}
