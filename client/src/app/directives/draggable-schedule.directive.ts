import {Directive, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2} from '@angular/core';
import {Subject} from "rxjs/internal/Subject";
import {AppointmentTypeScheduleDragInfo} from "../objects/appointment-type-schedule-drag-info";
import {Constants} from "../objects/constants";
import {AppointmentSchedule} from "../objects/appointment-schedule";
import {CardsGroup} from "../objects/cards-group";

@Directive({
	selector: '[appDraggableSchedule]'
})
export class DraggableScheduleDirective implements OnInit {

	private readonly HOUR_MINUTES: number = 60;

	@Input() appointmentTypeScheduleSubject: Subject<AppointmentTypeScheduleDragInfo[]>;
	@Input() initialDragInfo: AppointmentTypeScheduleDragInfo;

	@Output() updateSchedule: EventEmitter<string>;

	private pointerDownListener;
	private pointerMoveListener;
	private pointerUpListener;

	private dragInfo: AppointmentTypeScheduleDragInfo;
	private lastClientX: number;
	private lastStep: number;
	private rect: any;

	private dragSchedule: AppointmentTypeScheduleDragInfo[];

	constructor(
		private element: ElementRef,
		private renderer: Renderer2
	) {
		this.dragSchedule = [];
		this.lastStep = 0;
		this.lastClientX = 0;

		this.updateSchedule = new EventEmitter();
	}

	ngOnInit(): void {
		this.dragInfo = new AppointmentTypeScheduleDragInfo(
			this.initialDragInfo.hour,
			this.initialDragInfo.quarter,
			this.initialDragInfo.type
		);
		this.pointerDownListener = this.renderer.listen(
			this.element.nativeElement,
			'pointerdown',
			this.onPointerDown.bind(this)
		);
		this.rect = this.element.nativeElement.getBoundingClientRect();
	}

	onPointerDown(): void {
		this.dragSchedule.push(this.dragInfo);
		this.appointmentTypeScheduleSubject.next(this.dragSchedule);
		this.pointerMoveListener = this.renderer.listen(
			'document',
			'pointermove',
			this.onPointerMove.bind(this)
		);
		this.pointerUpListener = this.renderer.listen(
			'document',
			'pointerup',
			this.onPointerUp.bind(this)
		);
	}

	onPointerMove(event: PointerEvent): void {
		const step = Math.ceil((event.clientX - this.rect.right)/this.rect.width);
		const sign = Math.sign(event.clientX - this.lastClientX);

		if (step != this.lastStep) {
			const newQuarter = this.calcNewQuarter(this.dragInfo.quarter, sign, step);
			this.dragInfo = new AppointmentTypeScheduleDragInfo(
				this.calcNewHour(this.dragInfo.hour, newQuarter, sign),
				newQuarter,
				this.dragInfo.type
			);
			const existent = this.findSchedule(this.dragInfo.hour, this.dragInfo.quarter) != undefined;
			if (existent) {
				this.dragSchedule.pop();
			} else {
				this.dragSchedule.push(this.dragInfo);
			}
			this.appointmentTypeScheduleSubject.next(this.dragSchedule);
			this.lastStep = step;
		}
		this.lastClientX = event.clientX;
	}

	calcNewQuarter(baseQuarter: number, sign: number, step: number): number {
		return (baseQuarter + Constants.QUARTERS.STEP_15*sign + this.HOUR_MINUTES*Math.abs(step))%this.HOUR_MINUTES;
	}

	calcNewHour(baseHour: number, newQuarter: number, sign: number): number {
		const hourStep = ((newQuarter == 0 && sign > 0) || (newQuarter == Constants.QUARTERS.STEP_45 && sign < 0))
			? sign
			: 0;
		return baseHour + hourStep;
	}

	onPointerUp(): void {
		this.dragSchedule = [];
		this.dragInfo = new AppointmentTypeScheduleDragInfo(
			this.initialDragInfo.hour,
			this.initialDragInfo.quarter,
			this.initialDragInfo.type
		);
		this.updateSchedule.emit(this.dragInfo.type);

		this.pointerMoveListener();
		this.pointerUpListener();
	}

	private findSchedule(hour: number, quarter: number): AppointmentTypeScheduleDragInfo {
		return this.dragSchedule.find(s => s.hour == hour && s.quarter == quarter);
	}

}
