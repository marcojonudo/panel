import {DragScheduleBehaviour} from "./drag-schedule-behaviour";
import {CardPositionService} from "../../services/card-position.service";
import {DimensionsService} from "../../services/dimensions.service";
import {AppointmentsService} from "../../services/appointments.service";
import {UtilsService} from "../../services/utils.service";
import {Mechanic} from "../mechanic";
import {DragSchedulesService} from "../../services/drag-schedules.service";
import {Dayjs} from "dayjs";
import {Constants} from "../constants";
import {MechanicAppointment} from "../mechanic-appointment";

export class CreateScheduleBehaviour implements DragScheduleBehaviour {

	calcQuarterRefLeft(clientX: number): number {
		return UtilsService.roundFloor(
			CardPositionService.absolutePositionToLeft(clientX),
			DimensionsService.intervalWidth * 3
		)
	}

	createAppointment(
		appointment: MechanicAppointment, quarterRefLeft: number, appointmentTypeCode: string, mechanic: Mechanic
	): MechanicAppointment {
		const createSchedule = this.checkCreateSchedule(quarterRefLeft, mechanic);
		let mechanicAppointment = undefined;

		if (createSchedule) {
			const quarterEndLeft = DragSchedulesService.calcQuarterEndLeft(quarterRefLeft);
			const [quarterStart, quarterEnd] =
				DragSchedulesService.calcQuarterThresholdsStart(
					quarterRefLeft,
					quarterEndLeft,
					mechanic.day
				);
			mechanicAppointment = AppointmentsService.create(
				mechanic,
				AppointmentsService.findAppointmentType(appointmentTypeCode),
				quarterStart,
				quarterEnd
			);
		}
		return mechanicAppointment;
	}

	private checkCreateSchedule(quarterRefLeft: number, mechanic: Mechanic): boolean {
		const quarterRef = DimensionsService.calcStartFromLeft(quarterRefLeft, mechanic.day);
		const nextAppointment = mechanic.appointments.find((appointment: MechanicAppointment) => {
			const startDiff = appointment.interval.start.diff(quarterRef, Constants.DAY_JS.m);
			const endDiff = appointment.interval.end.diff(quarterRef, Constants.DAY_JS.m);
			/* Si se cumple esta condición, se está haciendo clic dentro del horario de otra cita, con un margen de 15
			*  minutos a izquierda y derecha. De esta forma, se evita crear otra nueva a no ser que se dejen, como
			*  mínimo, esos 15 minutos a ambos lados */
			return startDiff <= 15 && endDiff >= 0;
		});
		return nextAppointment == undefined;
	}

	findMovedQuarterRef(
		quarterRefLeft: number,
		movedQuarters: number,
		day: Dayjs
	): Dayjs {
		return DimensionsService.calcStartFromLeft(
			quarterRefLeft + movedQuarters * DimensionsService.intervalWidth * 3,
			day
		);
	}

	updateQuarterRef(
		quarterEnd: Dayjs,
		mechanic: Mechanic,
		appointment: MechanicAppointment
	): void {
		if (quarterEnd.isSame(appointment.interval.start) || quarterEnd.isAfter(appointment.interval.start)) {
			AppointmentsService.updateSchedule(mechanic, appointment, appointment.interval.start, quarterEnd);
		}
	}

	updateDatabase(
		appointmentsService: AppointmentsService, mechanic: Mechanic, appointment: MechanicAppointment
	): void {
		appointmentsService.createDb(mechanic, appointment);
	}

}
