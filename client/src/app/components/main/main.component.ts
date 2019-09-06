import {
	AfterViewInit,
	ChangeDetectionStrategy, ChangeDetectorRef,
	Component,
	ElementRef,
	OnDestroy, OnInit,
	Renderer2,
	ViewChild
} from '@angular/core';
import {TimeService} from "../../services/time.service";
import {DaysService} from "../../services/days.service";

@Component({
	selector: 'app-main',
	templateUrl: './main.component.html',
	styleUrls: ['./main.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent implements OnInit, OnDestroy {

	private _days: Date[];
	private itemSize: number;

	private _oneDayMode: boolean;
	private _maxSchedulePercentage: number;
	private _maxScheduleHours: number[];

	private relativeContainer: boolean;
	private scrollLeft: number;
	private scrollTop: number;
	// private _scrollLeft: number;

	private oneDayModeSubscription: any;
	private hourPercentageSubscription: any;

	// private clickedCardSubject;
	// private clickedCard$: Observable<boolean>;
	// private startPosition;

	// private unassignedCardsDays: any;
	// private assignedCards: any[];
	// private testList: any[];

	// private position: any;

	// private hide: boolean;

	// @ViewChild('schedulesContainer', {static: true}) schedulesContainer: ElementRef;

	constructor(
		private daysService: DaysService,
		private timeService: TimeService,
		private cdRef: ChangeDetectorRef
	) {
		this.days = this.daysService.days;
		// this.itemSize = this.mechanicsService.mechanics.length * (Constants.VALUE.LINE_HEIGHT_DEFAULT + 10);

		this.relativeContainer = true;
		this.scrollLeft = 0;
		this.scrollTop = 0;
	}

	ngOnInit(): void {
		this.oneDayModeSubscription = this.daysService.oneDayMode$.subscribe(oneDayMode => {
			this.oneDayMode = oneDayMode;
			this.maxScheduleHours = this.timeService.getMaxScheduleHours(oneDayMode);
			this.timeService.calcHourPercentageFromHoursInGrid(
				oneDayMode ? this.timeService.FIT_HOURS_IN_SCREEN : this.maxScheduleHours.length
			);
			this.maxSchedulePercentage = this.timeService.calcSchedulePercentage(this.maxScheduleHours);
		});

		this.hourPercentageSubscription = this.timeService.hourPercentage$.subscribe(hourPercentage => {
			this.maxSchedulePercentage = this.timeService.calcSchedulePercentage(this.maxScheduleHours);
			this.cdRef.detectChanges();
		});
	}

	ngOnDestroy(): void {
		this.oneDayModeSubscription.unsubscribe();
		this.hourPercentageSubscription.unsubscribe();
	}

	// region Getters / setters

	get days(): Date[] {
		return this._days;
	}

	set days(value: Date[]) {
		this._days = value;
	}

	get oneDayMode(): boolean {
		return this._oneDayMode;
	}

	set oneDayMode(value: boolean) {
		this._oneDayMode = value;
	}

	get maxSchedulePercentage(): number {
		return this._maxSchedulePercentage;
	}

	set maxSchedulePercentage(value: number) {
		this._maxSchedulePercentage = value;
	}

	get maxScheduleHours(): number[] {
		return this._maxScheduleHours;
	}

	set maxScheduleHours(value: number[]) {
		this._maxScheduleHours = value;
	}

	// endregion

	// get hourPercentage$() {
	// 	// console.log('PERCENTAGE WIDTH', Object.values(this.timeService.maxTodayScheduleHours)[0].length * 33);
	// 	// return Object.values(this.timeService.maxTodayScheduleHours)[0].length * 33;
	// 	return this.timeService.hourPercentage$;
	// }

	trackByDay(index, item) {
		return item
	}

	check() {
		console.log('checking main');
	}

}
