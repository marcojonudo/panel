import {
	ChangeDetectionStrategy, ChangeDetectorRef,
	Component,
	OnDestroy, OnInit,
} from '@angular/core';
import {TimeService} from "../../services/time.service";
import {DaysService} from "../../services/days.service";
import {Constants} from "../../objects/constants";
import {Subscription} from "rxjs/internal/Subscription";
import {CardsService} from "../../services/cards.service";
import {DayCardUpdate} from "../../objects/update-days-cards/day-card-update";
import {CardsGroup} from "../../objects/cards-group";

@Component({
	selector: 'app-main',
	templateUrl: './main.component.html',
	styleUrls: ['./main.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent implements OnInit, OnDestroy {

	private _days: Date[];
	private itemSize: number;
	private _displayScrollbar: boolean;
	private _showNonexistentScheduleMessage: boolean;

	private _assignedDaysCardsGroups: CardsGroup[];

	private _oneDayMode: boolean;
	private _maxScheduleWidth: number;
	private _maxScheduleHours: number[];

	private relativeContainer: boolean;
	private scrollLeft: number;
	private scrollTop: number;

	private oneDayModeSubscription: Subscription;
	private maxScheduleWidthSubscription: Subscription;
	private assignedCardsGroupsSubscription: Subscription;

	constructor(
		private daysService: DaysService,
		private timeService: TimeService,
		private cardsService: CardsService,
		private cdRef: ChangeDetectorRef
	) {
		this.days = this.daysService.days;

		this.oneDayMode = true;
		this.maxScheduleHours = this.timeService.updateMaxSchedule(this.oneDayMode);
		// this.itemSize = this.mechanicsService.mechanics.length * (Constants.VALUE.LINE_HEIGHT_DEFAULT + 10);

		this.relativeContainer = true;
		this.scrollLeft = 0;
		this.scrollTop = 0;

		this.showNonexistentScheduleMessage = !this.checkTodayScheduleExists();
	}

	ngOnInit(): void {
		this.assignedDaysCardsGroups = this.cardsService.assignedDaysCardsGroups;
		this.assignedCardsGroupsSubscription = this.cardsService.assignedCardsGroups$
				.subscribe((dayCardUpdate: DayCardUpdate) => {
			dayCardUpdate.update(this.assignedDaysCardsGroups);
			this.cdRef.detectChanges();
		});
		this.oneDayModeSubscription = this.daysService.oneDayMode$.subscribe(oneDayMode => {
			this.oneDayMode = oneDayMode;
			this.maxScheduleHours = this.timeService.updateMaxSchedule(oneDayMode);
			this.showNonexistentScheduleMessage = this.oneDayMode && !this.checkTodayScheduleExists();
			this.timeService.calcMaxScheduleWidth(oneDayMode);
		});
		this.maxScheduleWidthSubscription = this.timeService.maxScheduleWidth$.subscribe(maxScheduleWidth => {
			/* Se debe usar un observer distinto al anterior, en lugar de obtener el maxScheduleWidth directamente
			*  del valor retornado por calcMaxScheduleWidth, porque esa cifra también se puede calcular a partir
			*  del slider */
			this.maxScheduleWidth = maxScheduleWidth;
			this.cdRef.detectChanges();
		});

		/* Observer utilizado para determinar si es necesario mostrar o no la scrollbar */
		this.daysService.lineHeight$.subscribe((lineHeight: number) => {
			this.displayScrollbar = this.daysService.checkDisplayScrollbar(
				//TODO Modificar comparación de maxScheduleWidth
				this.timeService.gridHeight - (this.maxScheduleWidth == 100 ? 0 : 7),
				this.timeService.today,
				lineHeight
			);
			this.cdRef.detectChanges();
		});
	}

	ngOnDestroy(): void {
		this.oneDayModeSubscription.unsubscribe();
		this.maxScheduleWidthSubscription.unsubscribe();
		this.assignedCardsGroupsSubscription.unsubscribe();
	}

	// region Getters / setters

	get days(): Date[] {
		return this._days;
	}

	set days(value: Date[]) {
		this._days = value;
	}

	get assignedDaysCardsGroups(): CardsGroup[] {
		return this._assignedDaysCardsGroups;
	}

	set assignedDaysCardsGroups(value: CardsGroup[]) {
		this._assignedDaysCardsGroups = value;
	}

	get displayScrollbar(): boolean {
		return this._displayScrollbar;
	}

	set displayScrollbar(value: boolean) {
		this._displayScrollbar = value;
	}

	get showNonexistentScheduleMessage(): boolean {
		return this._showNonexistentScheduleMessage;
	}

	set showNonexistentScheduleMessage(value: boolean) {
		this._showNonexistentScheduleMessage = value;
	}

	get oneDayMode(): boolean {
		return this._oneDayMode;
	}

	set oneDayMode(value: boolean) {
		this._oneDayMode = value;
	}

	get maxScheduleWidth(): number {
		return this._maxScheduleWidth;
	}

	set maxScheduleWidth(value: number) {
		this._maxScheduleWidth = value;
	}

	get maxScheduleHours(): number[] {
		return this._maxScheduleHours;
	}

	set maxScheduleHours(value: number[]) {
		this._maxScheduleHours = value;
	}

	// endregion

	private findDayCardsGroups(day: Date): any {
		return this.assignedDaysCardsGroups[day.getTime()];
	}

	private checkTodayScheduleExists(today: Date = this.timeService.today): boolean {
		return this.daysService.findDayMechanics(today) != undefined;
	}

	trackByDay(index, item) {
		return item
	}

	check() {
		if (Constants.CHECK) {
			console.log('checking main');
		}
	}

}
