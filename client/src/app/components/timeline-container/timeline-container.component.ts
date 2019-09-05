import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

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
		console.log('checking timeline container', this.day, this.maxScheduleHours)
	}

}
