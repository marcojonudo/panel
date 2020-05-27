import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {DimensionsService} from "../../services/dimensions.service";
import {NotificationService} from "../../services/notification.service";
import {MechanicsService} from "../../services/mechanics.service";

@Component({
	selector: 'app-dimension-sliders',
	templateUrl: './dimension-sliders.component.html',
	styleUrls: ['./dimension-sliders.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DimensionSlidersComponent implements OnInit {

	@Input() maxScheduleWidth: number;
	@Input() maxScheduleMaxWidth: number;

	private readonly ZOOM_LEVELS: number = 4;

	private _min: number;
	private _max: number;

	ngOnInit(): void {
		if (this.checkEnableSlider()) {
			this.min = DimensionsService.gridWidth;
			this.max = parseFloat(this.maxScheduleMaxWidth.toFixed(2));
		}
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

	// endregion

	checkEnableSlider(): boolean {
		return DimensionsService.oneDayMode ? MechanicsService.todaySchedules : MechanicsService.futureSchedules
	}

	findStep(): number {
		return parseFloat(((this.max - this.min) / this.ZOOM_LEVELS).toFixed(4));
	}

	updateWidth() {
		DimensionsService.updateMaxScheduleWidth(this.maxScheduleWidth);
		NotificationService.notifyMaxScheduleWidth(this.maxScheduleWidth);
	}

}
