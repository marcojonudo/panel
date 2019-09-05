import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {TimeService} from "../../services/time.service";
import {DaysService} from "../../services/days.service";

@Component({
	selector: 'app-timeline',
	templateUrl: './timeline.component.html',
	styleUrls: ['./timeline.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimelineComponent implements OnInit {

	@Input() day: Date;
	@Input() maxScheduleHours: number[];

	private DISPLAY_MINUTES_THRESHOLD: number = 250;

	private _hours: number[];
	private quarters: string[];

	constructor(private daysService: DaysService, private timeService: TimeService) {}

	ngOnInit() {
		// this.daysService.oneDayMode$.subscribe(oneDayMode => {
		// 	this.hours = oneDayMode ? this.timeService.getMaxDayScheduleHours(this.day) : this.timeService.maxDaysSchedulesHours;
		// });
		// this.hours = this.timeService.getMaxDayScheduleHours(this.day);
		this.quarters = this.timeService.getQuarters();
	}

	// region Getters / setters

	get hours(): number[] {
		return this._hours;
	}

	set hours(value: number[]) {
		this._hours = value;
	}

	// endregion

	fitWidth() {
		let a = this.timeService.getTotalTimeWidth() === this.timeService.minWidth;
		return this.timeService.getTotalTimeWidth() === this.timeService.minWidth;
	}

	get percentageWidth$() {
		return this.timeService.percentageWidth$
	}

	get displayMinutesThreshold() {
		return this.DISPLAY_MINUTES_THRESHOLD;
	}

	check() {
		console.log('------ Timeline')
	}

}
