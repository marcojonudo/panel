import {Directive, ElementRef, Input, OnInit, Renderer2} from '@angular/core';
import {Constants} from "../objects/constants";
import {Mechanic} from "../objects/mechanic";
import {AppointmentsService} from "../services/appointments.service";
import {AppointmentSchedule} from "../objects/appointment-schedule";
import {DragSchedulesService} from "../services/drag-schedules.service";
import {DragScheduleBehaviour} from "../objects/drag-schedule-behaviour/drag-schedule-behaviour";
import {DimensionsService} from "../services/dimensions.service";
import {UtilsService} from "../services/utils.service";
import {NotificationService} from "../services/notification.service";
import {WarningToast} from "../objects/toasts/warning-toast";
import {ScheduleInterval} from "../objects/schedule-interval";
import {Dayjs} from "dayjs";

@Directive({
	selector: '[appDragSchedule]'
})
export class DragScheduleDirective implements OnInit {

	@Input() mechanic: Mechanic;
	@Input() appointment: AppointmentSchedule;
	@Input() behaviour: DragScheduleBehaviour;

	private pointerDownListener: () => void;
	private pointerMoveListener: () => void;
	private pointerUpListener: () => void;

	private lastMovedQuarter: number;

	private appointmentSchedule: AppointmentSchedule;
	private quarterRefLeft: number;
	private quarterRefStart: Dayjs;

	constructor(
		private appointmentsService: AppointmentsService,
		private element: ElementRef,
		private renderer: Renderer2
	) {
		this.lastMovedQuarter = 0;
	}

	ngOnInit(): void {
		this.pointerDownListener = this.renderer.listen(
			this.element.nativeElement,
			Constants.EVENT.POINTER_DOWN,
			this.onPointerDown.bind(this)
		);
	}

	onPointerDown(event: PointerEvent): void {
		if (DragSchedulesService.checkStartDragging(this.mechanic, event)) {
			this.quarterRefLeft = this.behaviour.calcQuarterRefLeft(event.clientX, this.appointment);
			this.quarterRefStart = DimensionsService.calcStartFromLeft(this.quarterRefLeft, this.mechanic.day);
			this.appointmentSchedule = this.behaviour.createAppointment(
				this.appointment,
				this.quarterRefLeft,
				AppointmentsService.dragSchedulesAppointmentType.code,
				this.mechanic
			);

			if (this.appointmentSchedule) {
				this.pointerMoveListener = this.renderer.listen(
					Constants.ELEMENT.DOCUMENT,
					Constants.EVENT.POINTER_MOVE,
					this.onPointerMove.bind(this)
				);
				this.pointerUpListener = this.renderer.listen(
					Constants.ELEMENT.DOCUMENT,
					Constants.EVENT.POINTER_UP,
					this.onPointerUp.bind(this)
				);
			} else {
				NotificationService.notifyToast(new WarningToast(Constants.MESSAGE.CREATE_SCHEDULE_TOO_CLOSE));
			}
		}
	}

	onPointerMove(event: PointerEvent): void {
		const movedQuarters = DragSchedulesService.calcMovedQuarters(event.clientX, this.quarterRefLeft);
		/* Sólo se ejecutan acciones si se ha movido el cursor lo suficiente como para rebasar un cuarto */
		if (movedQuarters != this.lastMovedQuarter) {
			const quarterRef = this.behaviour.findMovedQuarterRef(
				this.quarterRefLeft,
				movedQuarters,
				this.mechanic.day
			);
			if (this.validateMovement(quarterRef, movedQuarters > 0)) {
				this.lastMovedQuarter = movedQuarters;
				this.behaviour.updateQuarterRef(
					quarterRef,
					this.mechanic,
					this.appointmentSchedule
				);
			}
		}
	}

	onPointerUp(): void {
		this.lastMovedQuarter = 0;
		/* Si se ha movido el cursor (para evitar fallos al hacer clic sin pointermove) */
		if (this.appointmentSchedule.schedule.start.isSame(this.appointmentSchedule.schedule.end)) {
			AppointmentsService.delete(this.mechanic, this.appointmentSchedule);
			this.appointmentsService.deleteDb(this.appointmentSchedule)
		} else {
			this.behaviour.updateDatabase(this.appointmentsService, this.appointmentSchedule);
		}
		this.reset();
	}

	private validateMovement(quarterRef: Dayjs, draggingRight: boolean): boolean {
		const quarterRefTime = quarterRef.valueOf();
		const quarterRefStartTime = this.quarterRefStart.valueOf();
		if (!this.checkMovementInsideSchedule(quarterRefTime, quarterRefStartTime, draggingRight)) {
			return false;
		}
		const tooCloseSchedule = this.mechanic.appointments.find((appointment: AppointmentSchedule) => {
			const [startTime, endTime] = [appointment.schedule.start.valueOf(), appointment.schedule.end.valueOf()];
			if (appointment.equals(this.appointmentSchedule)) {
				return false;
			}
			if (draggingRight) {
				return quarterRefStartTime < startTime && quarterRefTime >= startTime;
			} else {
				return quarterRefStartTime > endTime && quarterRefTime <= endTime;
			}
		});
		return tooCloseSchedule == undefined;
	}

	private checkMovementInsideSchedule(
		quarterRefTime: number,
		quarterRefStartTime: number,
		draggingRight: boolean
	): boolean {
		const outsideSchedule = this.mechanic.schedules.find((schedule: ScheduleInterval) => {
			const [startTime, endTime] = [schedule.start.valueOf(), schedule.end.valueOf()];
			const insideSchedule = startTime <= quarterRefStartTime && quarterRefStartTime <= endTime;
			if (!insideSchedule) {
				return false;
			}
			if (draggingRight) {
				return quarterRefTime > endTime;
			} else {
				return quarterRefTime < startTime;
			}
		});
		return outsideSchedule == undefined;
	}

	private reset(): void {
		this.pointerMoveListener();
		this.pointerUpListener();
	}

}
