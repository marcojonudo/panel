import {ChangeDetectionStrategy, Component, OnDestroy} from '@angular/core';
import {TimeService} from "../../services/time.service";

@Component({
	selector: 'app-dimension-sliders',
	templateUrl: './dimension-sliders.component.html',
	styleUrls: ['./dimension-sliders.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DimensionSlidersComponent implements OnDestroy {

	private _min: number;
	private _max: number;

	private maxScheduleHoursSubscription: any;

	private _maxSchedulePercentage: number;


	constructor(private timeService: TimeService) {
		// this.min = this.timeService.getMinWidthValue();
		// this.max = this.timeService.getMaxWidthValue();
		this.min = this.timeService.minPercentageValue;
		this.maxScheduleHoursSubscription = this.timeService.maxScheduleHours$.subscribe(maxScheduleHours => {
			this.max = this.timeService.calcSchedulePercentage(maxScheduleHours);
		});
	}

	ngOnDestroy(): void {
		this.maxScheduleHoursSubscription.unsubscribe();
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

	get maxSchedulePercentage(): number {
		return this._maxSchedulePercentage;
	}

	set maxSchedulePercentage(value: number) {
		this._maxSchedulePercentage = value;
	}

	// endregion

	updatePercentage(value: number) {
		this.timeService.updatePercentage(this.max - (value - this.min));
	}

}
