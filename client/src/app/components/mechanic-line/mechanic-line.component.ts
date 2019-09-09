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
import {Constants} from "../../objects/constants";

@Component({
	selector: 'app-mechanic-line',
	templateUrl: './mechanic-line.component.html',
	styleUrls: ['./mechanic-line.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MechanicLineComponent implements OnInit, OnDestroy {

	@Input() mechanic: Mechanic;
	@Input() day: Date;
	@Input() maxScheduleHours: number[];

	private _leftPercentages: number[];

	private cardsSubscription: any;

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
	}

	ngOnDestroy(): void {
		this.cardsSubscription.unsubscribe();
	}

	// region Getters / setters

	get cardsGroups(): CardsGroup[] {
		return this._cardsGroups;
	}

	set cardsGroups(value: CardsGroup[]) {
		this._cardsGroups = value;
	}

	get leftPercentages(): number[] {
		return this._leftPercentages;
	}

	set leftPercentages(value: number[]) {
		this._leftPercentages = value;
	}

	// endregion

	getSchedulePercentages() {
		return this.mechanic.schedule.minutes.map(slotMinutes => {
			return UtilsService.calculateRelativePercentage(slotMinutes,this.maxScheduleHours.length * 60);
		});
	}

	getLeftPercentages() {
		return this.leftPercentages ? this.leftPercentages : this.mechanic.schedule.minutes.map((slotMinutes, i) => {
			return UtilsService.calculateRelativePercentage(
				UtilsService.getScheduleRefStartMinutes(this.mechanic.schedule.thresholds[i*2], this.maxScheduleHours[0]),
				this.maxScheduleHours.length * 60
			)
		});
	}

	trackByItem(index, item) {
		return item;
	}

	get lineHeight$() {
		return this.daysService.lineHeight$;
	}

	check() {
		if (Constants.CHECK) {
			console.log('checking mechanic line', this.maxScheduleHours);
		}
	}

}
