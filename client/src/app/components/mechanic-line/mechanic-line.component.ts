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

	private _hide: boolean;

	constructor(
		private timeService: TimeService,
		private cardsService: CardsService,
		private daysService: DaysService,
		private cdRef: ChangeDetectorRef
	) {
		this.cardsGroups = [];
		this.hide = false;
	}

	ngOnInit(): void {
		this.cardsGroups = this.cardsService.assignedDaysCardsGroups[this.day.getTime()][this.mechanic.position];
		if (this.cardsService.assignedDaysCardsGroups$[this.day.getTime()][this.mechanic.position]) {
			this.cardsSubscription = this.cardsService.assignedDaysCardsGroups$[this.day.getTime()][this.mechanic.position].subscribe(cardsGroups => {
				const replacedCardsGroups = this.cardsService.handleCardsGroupsListUpdate(this.cardsGroups, cardsGroups);
				if (replacedCardsGroups) {
					this.cardsGroups = replacedCardsGroups;
				}

				console.time('Detect assigned changes');
				this.cdRef.detectChanges();
				console.timeEnd('Detect assigned changes');
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

	get hide(): boolean {
		return this._hide;
	}

	set hide(value: boolean) {
		this._hide = value;
	}

	get lineHeight$() {
		return this.daysService.lineHeight$;
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

	hideGroup(hide) {
		this.hide = hide;
		this.cdRef.detectChanges();
	}

	trackByItem(index, item) {
		return item;
	}

	check() {
		if (Constants.CHECK) {
			console.log('checking mechanic line', this.maxScheduleHours);
		}
	}

}
