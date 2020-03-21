import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Constants} from "../../objects/constants";
import {QuartersSaturation} from "../../objects/quarters-saturation";
import {Dayjs} from "dayjs";
import {HourQuarter} from "../../objects/hour-quarter";

@Component({
	selector: 'app-timeline-container',
	templateUrl: './timeline-container.component.html',
	styleUrls: ['./timeline-container.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimelineContainerComponent {

	@Input() day: Dayjs;
	@Input() quartersSaturation: QuartersSaturation;
	@Input() maxScheduleHoursQuarter: HourQuarter[];
	@Input() maxScheduleWidth: number;

	get timelineHeight(): number {
		return Constants.VALUE.TIMELINE_HEIGHT;
	}

	check() {
		if (Constants.CHECK) {
			console.log('checking timeline container', this.day)
		}
	}

}
