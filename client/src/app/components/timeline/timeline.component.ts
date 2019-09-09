import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {TimeService} from "../../services/time.service";
import {DaysService} from "../../services/days.service";

@Component({
	selector: 'app-timeline',
	templateUrl: './timeline.component.html',
	styleUrls: ['./timeline.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimelineComponent implements OnInit, OnDestroy {

	@Input() day: Date;
	@Input() maxScheduleHours: number[];

	private readonly _HOUR_PERCENTAGE_DISPLAY_MINUTES_THRESHOLD: number = 15;

	private _quarters: string[];
	private _hourPercentage: number;

	private _maxSchedulePercentageSubscription: any;

	constructor(
		private daysService: DaysService,
		private timeService: TimeService,
		private cdRef: ChangeDetectorRef
	) {}

	ngOnInit(): void {
		this.quarters = this.timeService.QUARTERS;

		this.maxSchedulePercentageSubscription = this.timeService.maxSchedulePercentage$.subscribe(maxSchedulePercentage => {
			this.hourPercentage = this.timeService.calcHourPercentageFromMaxSchedulePercentage(maxSchedulePercentage);
			this.cdRef.detectChanges();
		})
	}

	ngOnDestroy(): void {
		this.maxSchedulePercentageSubscription.unsubscribe();
	}

	// region Getters / setters

	get quarters(): string[] {
		return this._quarters;
	}

	set quarters(value: string[]) {
		this._quarters = value;
	}

	get hourPercentage(): number {
		return this._hourPercentage;
	}

	set hourPercentage(value: number) {
		this._hourPercentage = value;
	}

	get maxSchedulePercentageSubscription(): any {
		return this._maxSchedulePercentageSubscription;
	}

	set maxSchedulePercentageSubscription(value: any) {
		this._maxSchedulePercentageSubscription = value;
	}

	get hourPercentageDisplayMinutesThreshold(): number {
		return this._HOUR_PERCENTAGE_DISPLAY_MINUTES_THRESHOLD;
	}

	// endregion

	check() {
		console.log('checking timeline', this.maxScheduleHours);
	}

}
