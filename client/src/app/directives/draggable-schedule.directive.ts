import {Directive, ElementRef, Input, OnInit, Renderer2} from '@angular/core';
import {Subject} from "rxjs/internal/Subject";
import {AppointmentTypeScheduleDragInfo} from "../objects/appointment-type-schedule-drag-info";

@Directive({
	selector: '[appDraggableSchedule]'
})
export class DraggableScheduleDirective implements OnInit {

	private readonly QUARTER_15: number = 15;
	private readonly QUARTER_45: number = 45;
	private readonly HOUR_MINUTES: number = 60;

	@Input() appointmentTypeScheduleSubject: Subject<AppointmentTypeScheduleDragInfo[]>;
	@Input() dragInfo: AppointmentTypeScheduleDragInfo;

	private pointerDownListener;
	private pointerMoveListener;
	private pointerUpListener;

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
	}

	ngOnInit(): void {
		this.pointerDownListener = this.renderer.listen(
			this.element.nativeElement,
			'pointerdown',
			this.onPointerDown.bind(this)
		);
		this.rect = this.element.nativeElement.getBoundingClientRect();
	}

	onPointerDown(event: PointerEvent): void {
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
				this.calcNewHour(this.dragInfo.hour, newQuarter, sign, step),
				newQuarter
			);
			console.log(this.dragInfo);
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
		return (baseQuarter + this.QUARTER_15*sign + this.HOUR_MINUTES*Math.abs(step))%this.HOUR_MINUTES;
	}

	calcNewHour(baseHour: number, newQuarter: number, sign: number, step: number): number {
		const hourStep = ((newQuarter == 0 && sign > 0) || (newQuarter == this.QUARTER_45 && sign < 0))
			? sign
			: 0;
		return baseHour + hourStep;
	}

	onPointerUp(): void {
		console.log('pointerup');

		this.pointerMoveListener();
		this.pointerUpListener();
	}

	private findSchedule(hour: number, quarter: number): AppointmentTypeScheduleDragInfo {
		return this.dragSchedule.find(s => s.hour == hour && s.quarter == quarter);
	}

}
