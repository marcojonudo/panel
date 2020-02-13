import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Constants} from "../../objects/constants";
import {DimensionsService} from "../../services/dimensions.service";
import {QuartersSaturation} from "../../objects/quarters-saturation";
import {UtilsService} from "../../services/utils.service";

@Component({
	selector: 'app-timeline',
	templateUrl: './timeline.component.html',
	styleUrls: ['./timeline.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimelineComponent {

	@Input() day: Date;
	@Input() quartersSaturation: QuartersSaturation;
	@Input() maxScheduleHours: number[];
	@Input() maxScheduleWidth: number;

	private readonly MAX_SCHEDULE_WIDTH_THRESHOLD: number = 3500;
	private readonly QUARTERS: string[] = ['00', '15', '30', '45'];

	// region Getters / setters

	get quarters(): string[] {
		return this.QUARTERS;
	}

	get quarterWidth(): number {
		return parseFloat((DimensionsService.intervalWidth * 3).toFixed(2));
	}

	// endregion

	findQuarterBackground(
		hour: number,
		quarter: number,
		quartersSaturation: QuartersSaturation = this.quartersSaturation,
		mechanicsSaturationPercentage: number = Constants.VALUE.MECHANICS_SATURATION_PERCENTAGE
	): boolean {
		const quarterSaturation = quartersSaturation[UtilsService.calcMinutes(hour, quarter)];
		if (!quarterSaturation) {
			return false;
		}
		return quarterSaturation.cards > quarterSaturation.mechanics * mechanicsSaturationPercentage/100;
	}

	checkDisplayMinutes(): boolean {
		return this.maxScheduleWidth > this.MAX_SCHEDULE_WIDTH_THRESHOLD;
	}

	check() {
		if (Constants.CHECK) {
			console.log('checking timeline', this.maxScheduleHours);
		}
	}

}
