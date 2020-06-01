import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Constants} from "../../objects/constants";
import {QuartersSaturation} from "../../objects/quarters-saturation";
import {UtilsService} from "../../services/utils.service";
import {HourQuarter} from "../../objects/hour-quarter";
import { Dayjs } from 'dayjs';

@Component({
	selector: 'app-timeline',
	templateUrl: './timeline.component.html',
	styleUrls: ['./timeline.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimelineComponent {

	@Input() day: Dayjs;
	@Input() quartersSaturation: QuartersSaturation;
	@Input() maxScheduleHoursQuarter: HourQuarter[];
	@Input() maxScheduleWidth: number;

	private readonly MAX_SCHEDULE_WIDTH_THRESHOLD: number = 3500;

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

	checkDisplayHours(quarter: number): boolean {
		return quarter == 0;
	}

	checkDisplayMinutes(): boolean {
		return this.maxScheduleWidth > this.MAX_SCHEDULE_WIDTH_THRESHOLD;
	}

	check() {
		if (Constants.CHECK) {
			console.log('checking timeline', this.maxScheduleHoursQuarter);
		}
	}

}
