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
	private percentage: number;

	private maxSchedulePercentageSubscription: any;

	constructor(
		private timeService: TimeService,
		private cdRef: ChangeDetectorRef
	) {
		this.min = this.timeService.minPercentageValue;
	}

	ngOnInit(): void {
		this.maxSchedulePercentageSubscription = this.timeService.maxSchedulePercentage$.subscribe(maxSchedulePercentage => {
			if (!this.max) {
				this.max = maxSchedulePercentage;
			}
			this.percentage = maxSchedulePercentage;
			this.step = parseInt(((this.max - this.min) / this.ZOOM_LEVELS).toFixed(2));
			this.cdRef.detectChanges();
		});
	}

	ngOnDestroy(): void {
		this.maxSchedulePercentageSubscription.unsubscribe();
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

	// endregion

	updatePercentage() {
		this.timeService.updatePercentage(this.percentage);
	}

}
