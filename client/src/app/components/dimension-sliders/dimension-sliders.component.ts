import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {TimeService} from "../../services/time.service";

@Component({
	selector: 'app-dimension-sliders',
	templateUrl: './dimension-sliders.component.html',
	styleUrls: ['./dimension-sliders.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DimensionSlidersComponent implements OnInit, OnDestroy {

	private readonly ZOOM_LEVELS: number = 4;

	private _min: number;
	private _max: number;
	private _step: number;
	private _width: number;

	private maxScheduleWidthSubscription: any;
	private maxScheduleMaxWidthSubscription: any;

	constructor(
		private timeService: TimeService,
		private cdRef: ChangeDetectorRef
	) {
		this.min = this.timeService.gridWidth;
	}

	ngOnInit(): void {
		this.maxScheduleWidthSubscription = this.timeService.maxScheduleWidth$.subscribe(maxScheduleWidth => {
			this.width = maxScheduleWidth;
			this.cdRef.detectChanges();
		});
		this.maxScheduleMaxWidthSubscription = this.timeService.maxScheduleMaxWidth$.subscribe(maxScheduleMaxWidth => {
			this.max = maxScheduleMaxWidth;
			/* Se limitan los decimales porque con el número por defecto, el step no llega al max y en el slider se
			*  muestra la bola en un punto medio del eje */
			this.step = parseFloat(((this.max - this.min) / this.ZOOM_LEVELS).toFixed(4));
			this.cdRef.detectChanges();
		});
	}

	ngOnDestroy(): void {
		this.maxScheduleWidthSubscription.unsubscribe();
		this.maxScheduleMaxWidthSubscription.unsubscribe();
	}

	// region Getters / setters

	get min(): number {
		return this._min;
	}

	set min(value: number) {
		this._min = value;
	}

	get max(): number {
		return this._max;
	}

	set max(value: number) {
		this._max = value;
	}

	get step(): number {
		return this._step;
	}

	set step(value: number) {
		this._step = value;
	}

	get width(): number {
		return this._width;
	}

	set width(value: number) {
		this._width = value;
	}

	// endregion

	updateWidth() {
		this.timeService.updateMaxScheduleWidth(this.width);
	}

}
