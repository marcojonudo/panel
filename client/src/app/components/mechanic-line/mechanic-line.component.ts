import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit,} from '@angular/core';
import {TimeService} from "../../services/time.service";
import {Draggable, Droppable} from "@shopify/draggable"
import {CardsService} from "../../services/cards.service";
import {Mechanic} from "../../objects/mechanic";
import {DaysService} from "../../services/days.service";
import {Card} from "../../objects/card";
import {ResizeEvent} from "angular-resizable-element";
import {CardsGroup} from "../../objects/cards-group";
import {UtilsService} from "../../services/utils.service";

@Component({
	selector: 'app-mechanic-line',
	templateUrl: './mechanic-line.component.html',
	styleUrls: ['./mechanic-line.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MechanicLineComponent implements OnInit, OnDestroy {

	@Input() maxScheduleHours: number[];

	private HOUR_WIDTH: number = 360;

	// private _maxScheduleHours: number[];
	private _hourPercentage: number[];
	private schedulePercentage: number;
	private schedulePercentages: number[];
	private leftPercentage: number;
	private leftPercentages: number[];

	private cardsSubscription: any;

	@Input() mechanic: Mechanic;
	@Input() day: Date;

	private _cardsGroups: CardsGroup[];

	constructor(
		private timeService: TimeService,
		private cardsService: CardsService,
		private daysService: DaysService,
		private cdRef: ChangeDetectorRef
	) {}

	ngOnInit(): void {
		if (this.cardsService.assignedDaysCardsGroups$[this.day.getTime()][this.mechanic.position]) {
			this.cardsSubscription = this.cardsService.assignedDaysCardsGroups$[this.day.getTime()][this.mechanic.position].subscribe(cardsGroup => {
				this.cardsGroups = cardsGroup;
				this.cdRef.detectChanges();
			});
		}

		// this.daysService.oneDayMode$.subscribe(oneDayMode => {
		// 	const maxScheduleHours = oneDayMode ? this.timeService.getMaxDayScheduleHours(this.day) : this.timeService.maxDaysSchedulesHours;
		// 	// this.hours = oneDayMode ? this.timeService.getMaxDayScheduleHours(this.day) : this.timeService.maxDaysSchedulesHours;
		// });

		this.schedulePercentage = UtilsService.calculateRelativePercentage(
			this.mechanic.schedule.getAllMinutes(),
			this.maxScheduleHours.length * 60
		);

		this.schedulePercentages = this.mechanic.schedule.minutes.map(slotMinutes => {
			return UtilsService.calculateRelativePercentage(slotMinutes,this.maxScheduleHours.length * 60);
		});
		this.leftPercentage = UtilsService.calculateRelativePercentage(
			UtilsService.getScheduleRefStartMinutes(this.mechanic.schedule.start, this.maxScheduleHours[0]),
			this.maxScheduleHours.length * 60
		);
		this.leftPercentages = this.mechanic.schedule.minutes.map((slotMinutes, i) => {
			return UtilsService.calculateRelativePercentage(
				UtilsService.getScheduleRefStartMinutes(this.mechanic.schedule.thresholds[i*2], this.maxScheduleHours[0]),
				this.maxScheduleHours.length * 60
			)
		});
		console.log('PERCENTAGES IN LINE',
			this.mechanic.schedule,
			this.schedulePercentage,
			this.schedulePercentages,
			this.leftPercentage,
			this.leftPercentages
		);
		// this.maxScheduleHours = this.timeService.getMaxDayScheduleHours(this.day);
		// console.log('maxScheduleHours', this.maxScheduleHours);
		this.cdRef.detectChanges();
	}

	ngOnDestroy(): void {
		this.cardsSubscription.unsubscribe();
	}

	// region Getters / setters

	// get maxScheduleHours(): number[] {
	// 	return this._maxScheduleHours;
	// }
	//
	// set maxScheduleHours(value: number[]) {
	// 	this._maxScheduleHours = value;
	// }

	get cardsGroups(): CardsGroup[] {
		return this._cardsGroups;
	}

	set cardsGroups(value: CardsGroup[]) {
		this._cardsGroups = value;
	}

	// get hourPercentage(): number[] {
	// 	return this._hourPercentage;
	// }
	//
	// set hourPercentage(value: number[]) {
	// 	this._hourPercentage = value;
	// }

	// endregion

	trackByItem(index, item) {
		return item;
	}

	get lineHeight$() {
		return this.daysService.lineHeight$;
	}

	check() {
		console.log('checking mechanic line', this.day, this.mechanic, this._cardsGroups);
	}

}
