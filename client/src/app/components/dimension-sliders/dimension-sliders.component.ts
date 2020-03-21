import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {DimensionsService} from "../../services/dimensions.service";
import {NotificationService} from "../../services/notification.service";

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
	private _width: number;

	ngOnInit(): void {
		this.width = this.maxScheduleWidth;
		this.min = DimensionsService.gridWidth;
		this.max = parseFloat(this.maxScheduleMaxWidth.toFixed(3));
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

	get width(): number {
		return this._width;
	}

	set width(value: number) {
		this._width = value;
	}

	// endregion

	findStep(): number {
		return parseFloat(((this.max - this.min) / this.ZOOM_LEVELS).toFixed(4));
	}

	updateWidth() {
		DimensionsService.updateMaxScheduleWidth(this.width);
		NotificationService.notifyMaxScheduleWidth(this.width);
	}

}
