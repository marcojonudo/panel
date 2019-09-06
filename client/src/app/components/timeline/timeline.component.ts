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
	private _widthPercentage: number;

	private _widthPercentageSubscription: any;

	constructor(
		private daysService: DaysService,
		private timeService: TimeService,
		private cdRef: ChangeDetectorRef
	) {}

	ngOnInit(): void {
		this.quarters = this.timeService.QUARTERS;

		this.widthPercentageSubscription = this.timeService.hourPercentage$.subscribe(widthPercentage => {
			this.widthPercentage = widthPercentage;
			this.cdRef.detectChanges();
		})
	}

	ngOnDestroy(): void {
		this.widthPercentageSubscription.unsubscribe();
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

	get hourPercentageDisplayMinutesThreshold() {
		return this._HOUR_PERCENTAGE_DISPLAY_MINUTES_THRESHOLD;
	}

	// endregion

	// fitWidth() {
	// 	let a = this.timeService.getTotalTimeWidth() === this.timeService.minWidth;
	// 	return this.timeService.getTotalTimeWidth() === this.timeService.minWidth;
	// }
	//
	// get hourPercentage$() {
	// 	return this.timeService.hourPercentage$
	// }


	check() {
		console.log('------ Timeline')
	}

}
