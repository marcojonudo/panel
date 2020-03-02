import {Directive, ElementRef, Input, OnInit, Renderer2} from '@angular/core';
import {Constants} from "../objects/constants";
import {Mechanic} from "../objects/mechanic";
import {AppointmentsService} from "../services/appointments.service";
import {AppointmentSchedule} from "../objects/appointment-schedule";
import {DragSchedulesService} from "../services/drag-schedules.service";
import {DragScheduleBehaviour} from "../objects/drag-schedule-behaviour/drag-schedule-behaviour";
import {DimensionsService} from "../services/dimensions.service";

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
		if (this.appointment) {
			this.appointmentSchedule = this.appointment;
		}
	}

	onPointerDown(event: PointerEvent): void {
		if (AppointmentsService.dragSchedulesMode) {
			// this.quarterStartLeft = this.behaviour.calcQuarterRefLeft(event.clientX, this.appointmentSchedule);
			this.quarterRefLeft = this.behaviour.calcQuarterRefLeft(event.clientX, this.appointmentSchedule);
			if (!this.appointmentSchedule) {
				/* Si se está reando un horario nuevo, la referencia calculada previamente es la izquierda del cuarto
				*  en el que se hizo clic */
				const quarterEndLeft = DragSchedulesService.calcQuarterEndLeft(this.quarterRefLeft);
				const [quarterStart, quarterEnd] =
					DragSchedulesService.calcQuarterThresholdsStart(
						this.quarterRefLeft,
						quarterEndLeft,
						this.mechanic.day
					);
				this.appointmentSchedule = AppointmentsService.create(
					this.mechanic,
					AppointmentsService.findAppointmentType("RAP"),
					quarterStart,
					quarterEnd
				);
			}

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
	}

	onPointerMove(event: PointerEvent): void {
		const movedQuarters = DragSchedulesService.calcMovedQuarters(event.clientX, this.quarterRefLeft);
		/* Sólo se ejecutan acciones si se ha movido el cursor lo suficiente como para rebasar un cuarto */
		if (movedQuarters != this.lastMovedQuarter) {
			this.lastMovedQuarter = movedQuarters;
			this.behaviour.updateQuarterRef(
				this.quarterRefLeft,
				movedQuarters,
				this.mechanic,
				this.appointmentSchedule
			);
		}
	}

	onPointerUp(): void {
		this.lastMovedQuarter = 0;
		if (this.appointmentSchedule.schedule.start.getTime() == this.appointmentSchedule.schedule.end.getTime()) {
			this.appointmentsService.delete(this.mechanic, this.appointmentSchedule);
		} else {
			this.behaviour.updateDatabase(this.appointmentsService, this.appointmentSchedule);
		}
		this.reset();
	}

	reset(): void {
		this.pointerMoveListener();
		this.pointerUpListener();
	}

}
