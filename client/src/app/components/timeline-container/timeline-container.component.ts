import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Constants} from "../../objects/constants";

@Component({
	selector: 'app-timeline-container',
	templateUrl: './timeline-container.component.html',
	styleUrls: ['./timeline-container.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimelineContainerComponent {

	@Input() day: Date;
	@Input() maxScheduleHours: number[];

	constructor() {
	}

	check() {
		if (Constants.CHECK) {
			console.log('checking timeline container', this.day, this.maxScheduleHours)
		}
	}

}
