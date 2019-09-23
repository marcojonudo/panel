import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {TimeService} from "../../services/time.service";
import {DaysService} from "../../services/days.service";
import {Constants} from "../../objects/constants";

@Component({
	selector: 'app-timeline',
	templateUrl: './timeline.component.html',
	styleUrls: ['./timeline.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimelineComponent implements OnInit, OnDestroy {

	@Input() day: Date;
	@Input() maxScheduleHours: number[];

	private readonly MAX_SCHEDULE_WIDTH_THRESHOLD: number = 2500;

	private _displayMinutes: boolean;
	private _quarters: string[];

	private _maxScheduleWidthSubscription: any;

	constructor(
		private daysService: DaysService,
		private timeService: TimeService,
		private cdRef: ChangeDetectorRef
	) {}

	ngOnInit(): void {
		this.quarters = this.timeService.QUARTERS;

		this.maxScheduleWidthSubscription = this.timeService.maxScheduleWidth$.subscribe(maxScheduleWidth => {
			this.displayMinutes = maxScheduleWidth > this.MAX_SCHEDULE_WIDTH_THRESHOLD;
			this.cdRef.detectChanges();
		})
	}

	ngOnDestroy(): void {
		this.maxScheduleWidthSubscription.unsubscribe();
	}

	// region Getters / setters

	get displayMinutes(): boolean {
		return this._displayMinutes;
	}

	set displayMinutes(value: boolean) {
		this._displayMinutes = value;
	}

	get quarters(): string[] {
		return this._quarters;
	}

	set quarters(value: string[]) {
		this._quarters = value;
	}

	get maxScheduleWidthSubscription(): any {
		return this._maxScheduleWidthSubscription;
	}

	set maxScheduleWidthSubscription(value: any) {
		this._maxScheduleWidthSubscription = value;
	}

	get quarterWidth() {
		return (this.timeService.intervalWidth * 3).toFixed(2);
	}

	// endregion

	check() {
		if (Constants.CHECK) {
			console.log('checking timeline', this.maxScheduleHours);
		}
	}

}
