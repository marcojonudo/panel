import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TimeService} from "../../services/time.service";

@Component({
	selector: 'app-dimension-sliders',
	templateUrl: './dimension-sliders.component.html',
	styleUrls: ['./dimension-sliders.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DimensionSlidersComponent {

	private _min: number;
	private _max: number;

	constructor(private timeService: TimeService) {
		this._min = this.timeService.getMinWidthValue();
		this._max = this.timeService.getMaxWidthValue();
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

	updateWidth(value: number) {
		this.timeService.setWidthValue(this._max - (value - this._min));
	}

}
