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
import {Constants} from "../../objects/constants";

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
	private maxSchedulePercentageSubscription: any;

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

		this.oneDayMode = true;
		this.maxScheduleHours = this.timeService.updateMaxSchedule(this.oneDayMode);
		// this.itemSize = this.mechanicsService.mechanics.length * (Constants.VALUE.LINE_HEIGHT_DEFAULT + 10);

		this.relativeContainer = true;
		this.scrollLeft = 0;
		this.scrollTop = 0;
	}

	ngOnInit(): void {
		this.oneDayModeSubscription = this.daysService.oneDayMode$.subscribe(oneDayMode => {
			this.oneDayMode = oneDayMode;
			this.maxScheduleHours = this.timeService.updateMaxSchedule(oneDayMode);
			this.timeService.calcMaxSchedulePercentage(oneDayMode);
		});
		this.maxSchedulePercentageSubscription = this.timeService.maxSchedulePercentage$.subscribe(maxSchedulePercentage => {
			/* Se debe usar un observer distinto al anterior, en lugar de obtener el maxSchedulePercentage directamente
			*  del valor retornado por calcMaxSchedulePercentage, porque esa cifra también se puede calcular a partir
			*  del slider */
			this.maxSchedulePercentage = maxSchedulePercentage;
			this.cdRef.detectChanges();
		})
	}

	ngOnDestroy(): void {
		this.oneDayModeSubscription.unsubscribe();
		this.maxSchedulePercentageSubscription.unsubscribe();
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
		if (Constants.CHECK) {
			console.log('checking main');
		}
	}

}
