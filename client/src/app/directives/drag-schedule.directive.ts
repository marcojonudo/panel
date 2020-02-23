import {Directive, ElementRef, Input, OnInit, Renderer2} from '@angular/core';
import {Constants} from "../objects/constants";
import {DimensionsService} from "../services/dimensions.service";
import {CardPositionService} from "../services/card-position.service";
import {Mechanic} from "../objects/mechanic";
import {UtilsService} from "../services/utils.service";
import {AppointmentsService} from "../services/appointments.service";
import {AppointmentSchedule} from "../objects/appointment-schedule";

@Directive({
	selector: '[appDragSchedule]'
})
export class DragScheduleDirective implements OnInit {

	@Input() mechanic: Mechanic;

	private pointerDownListener: () => void;
	private pointerMoveListener: () => void;
	private pointerUpListener: () => void;

	private lastMovedQuarter: number;

	private appointmentSchedule: AppointmentSchedule;
	private quarterEndLeft: number;
	private quarterStart: Date;
	private quarterEnd: Date;

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
		const left = CardPositionService.absolutePositionToLeft(event.clientX);
		const [quarterStartLeft, quarterEndLeft] = [
			UtilsService.roundFloor(left, DimensionsService.intervalWidth * 3),
			UtilsService.roundCeil(left, DimensionsService.intervalWidth * 3)
		];
		this.quarterEndLeft = quarterEndLeft;
		[this.quarterStart, this.quarterEnd] = [
			DimensionsService.calcStartFromLeft(quarterStartLeft, this.mechanic.day),
			DimensionsService.calcStartFromLeft(quarterEndLeft, this.mechanic.day)
		];
		this.appointmentSchedule = this.appointmentsService.create(
			this.mechanic,
			this.appointmentsService.findAppointmentType("RAP"),
			this.quarterStart,
			this.quarterEnd
		);

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
	}

	onPointerMove(event: PointerEvent): void {
		const left = CardPositionService.absolutePositionToLeft(event.clientX);
		const movedQuarters = Math.ceil((left - this.quarterEndLeft) / (DimensionsService.intervalWidth * 3));
		/* Sólo se ejecutan acciones si se ha movido el cursor lo suficiente como para rebasar un cuarto */
		if (movedQuarters != this.lastMovedQuarter) {
			/* Si movedQuarters es mayor que 0, se debe actualizar la hora de finalización del horario */
			if (movedQuarters >= 0) {
				const quarterEnd = DimensionsService.calcStartFromLeft(
					this.quarterEndLeft + movedQuarters * DimensionsService.intervalWidth * 3,
					this.mechanic.day
				);
				this.lastMovedQuarter = movedQuarters;
				this.appointmentsService.updateSchedule(
					this.mechanic,
					this.appointmentSchedule,
					this.quarterStart,
					quarterEnd
				);
			} else {
				/* En este caso, se colapsó el horario, por lo que se elimina la cita */
				this.appointmentsService.delete(this.mechanic, this.appointmentSchedule);
				this.resetListeners();
			}
		}
	}

	onPointerUp(): void {
		this.lastMovedQuarter = 0;
		this.resetListeners();
	}

	resetListeners(): void {
		this.pointerMoveListener();
		this.pointerUpListener();
	}

}
