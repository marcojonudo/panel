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

	private readonly _HOUR_PERCENTAGE_DISPLAY_MINUTES_THRESHOLD: number = 15;

	private _quarters: string[];
	private _widthPercentage: number;

	private _widthPercentageSubscription: any;

	constructor(private daysService: DaysService, private timeService: TimeService) {}

	ngOnInit() {
		this.quarters = this.timeService.QUARTERS;

		this.widthPercentageSubscription = this.timeService.widthPercentage$.subscribe(widthPercentage => {
			this.widthPercentage = widthPercentage;
		})
		// this.maxScheduleHoursQuarters = [];
		// this.maxScheduleHours.forEach(hour => {
		// 	this.maxScheduleHoursQuarters.push(`${hour}:${this.timeService.QUARTERS[0]}`, ...this.timeService.QUARTERS.slice(1));
		// });
		// this.maxScheduleHoursQuarters = this.maxScheduleHours.map(hour => {
		// 	return {hour: hour, quarters: this.timeService.QUARTERS};
		// });
	}

	// region Getters / setters

	get quarters(): string[] {
		return this._quarters;
	}

	set quarters(value: string[]) {
		this._quarters = value;
	}

	get widthPercentage(): number {
		return this._widthPercentage;
	}

	set widthPercentage(value: number) {
		this._widthPercentage = value;
	}

	get widthPercentageSubscription(): any {
		return this._widthPercentageSubscription;
	}

	set widthPercentageSubscription(value: any) {
		this._widthPercentageSubscription = value;
	}

	// endregion

	fitWidth() {
		let a = this.timeService.getTotalTimeWidth() === this.timeService.minWidth;
		return this.timeService.getTotalTimeWidth() === this.timeService.minWidth;
	}

	get widthPercentage$() {
		return this.timeService.widthPercentage$
	}

	get hourPercentageDisplayMinutesThreshold() {
		return this._HOUR_PERCENTAGE_DISPLAY_MINUTES_THRESHOLD;
	}

	check() {
		console.log('------ Timeline')
	}

}
