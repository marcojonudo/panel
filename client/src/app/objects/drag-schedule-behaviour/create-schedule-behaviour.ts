import {DragScheduleBehaviour} from "./drag-schedule-behaviour";
import {CardPositionService} from "../../services/card-position.service";
import {DimensionsService} from "../../services/dimensions.service";
import {AppointmentsService} from "../../services/appointments.service";
import {UtilsService} from "../../services/utils.service";
import {AppointmentSchedule} from "../appointment-schedule";
import {Mechanic} from "../mechanic";

export class CreateScheduleBehaviour implements DragScheduleBehaviour {

	calcQuarterRefLeft(clientX: number, appointment: AppointmentSchedule): number {
		return UtilsService.roundFloor(
			CardPositionService.absolutePositionToLeft(clientX),
			DimensionsService.intervalWidth * 3
		)
	}

	updateQuarterRef(
		quarterRefLeft: number,
		movedQuarters: number,
		mechanic: Mechanic,
		appointment: AppointmentSchedule
	): void {
		const quarterEnd = DimensionsService.calcStartFromLeft(
			quarterRefLeft + movedQuarters * DimensionsService.intervalWidth * 3,
			mechanic.day
		);
		AppointmentsService.updateSchedule(
			mechanic,
			appointment,
			appointment.schedule.start,
			quarterEnd
		);
	}

}
