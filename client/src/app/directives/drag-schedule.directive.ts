import {Directive, ElementRef, Input, OnInit, Renderer2} from '@angular/core';
import {Constants} from "../objects/constants";
import {Mechanic} from "../objects/mechanic";
import {AppointmentsService} from "../services/appointments.service";
import {AppointmentSchedule} from "../objects/appointment-schedule";
import {DragSchedulesService} from "../services/drag-schedules.service";
import {DragScheduleBehaviour} from "../objects/drag-schedule-behaviour/drag-schedule-behaviour";
import {DimensionsService} from "../services/dimensions.service";
import {NotificationService} from "../services/notification.service";
import {WarningToast} from "../objects/toasts/warning-toast";
import {Dayjs} from "dayjs";
import {MechanicAppointment} from "../objects/mechanic-appointment";
import {ScheduleInterval} from "../objects/schedule-interval";

@Directive({
	selector: '[appDragSchedule]'
})
export class DragScheduleDirective implements OnInit {

	@Input() mechanic: Mechanic;
	@Input() appointment: MechanicAppointment;
	@Input() behaviour: DragScheduleBehaviour;

	private pointerDownListener: () => void;
	private pointerMoveListener: () => void;
	private pointerUpListener: () => void;

	private lastMovedQuarter: number;

	private initInterval: ScheduleInterval;
	private mechanicAppointment: MechanicAppointment;
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
			this.mechanicAppointment = this.behaviour.createAppointment(
				this.appointment,
				this.quarterRefLeft,
				AppointmentsService.dragSchedulesAppointmentType.code,
				this.mechanic
			);

			if (this.mechanicAppointment) {
				this.initInterval = this.mechanicAppointment.interval.clone();
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
					this.mechanicAppointment
				);
			}
		}
	}

	onPointerUp(): void {
		this.lastMovedQuarter = 0;
		/* Si se ha movido el cursor (para evitar fallos al hacer clic sin pointermove) */
		if (this.mechanicAppointment.interval.start.isSame(this.mechanicAppointment.interval.end)) {
			AppointmentsService.delete(this.mechanic, this.mechanicAppointment);
			this.appointmentsService.deleteDb(this.mechanic, this.mechanicAppointment, this.initInterval);
		} else {
			this.behaviour.updateDatabase(
				this.appointmentsService, this.mechanic, this.mechanicAppointment, this.initInterval
			);
		}
		this.reset();
	}

	private validateMovement(quarterRef: Dayjs, draggingRight: boolean): boolean {
		const quarterRefTime = quarterRef.valueOf();
		const quarterRefStartTime = this.quarterRefStart.valueOf();
		if (!this.checkMovementInsideSchedule(quarterRefTime, quarterRefStartTime, draggingRight)) {
			return false;
		}
		const tooCloseSchedule = this.mechanic.appointments.find((appointment: MechanicAppointment) => {
			if (appointment.equals(this.mechanicAppointment)) {
				return false;
			}
			const [startTime, endTime] = [appointment.interval.start.valueOf(), appointment.interval.end.valueOf()];
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
		const outsideSchedule = this.mechanic.intervals.find(interval => {
			const [startTime, endTime] = [interval.start.valueOf(), interval.end.valueOf()];
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
