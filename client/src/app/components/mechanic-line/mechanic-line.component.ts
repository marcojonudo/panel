import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {TimeService} from "../../services/time.service";
import {CardsService} from "../../services/cards.service";
import {Mechanic} from "../../objects/mechanic";
import {DaysService} from "../../services/days.service";
import {CardsGroup} from "../../objects/cards-group";
import {Constants} from "../../objects/constants";
import {CardUpdate} from "../../objects/update-cards/card-update";

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
	@Input() maxScheduleWidth: number;

	private cardsSubscription: any;

	private _cardsGroups: CardsGroup[];

	private _hiddenCardsGroup: CardsGroup;

	private quarterBackground: any;

	constructor(
		private timeService: TimeService,
		private cardsService: CardsService,
		private daysService: DaysService,
		private cdRef: ChangeDetectorRef
	) {
		this.cardsGroups = [];
		this.quarterBackground = {
			0: 1,
			15: 1,
			30: 1,
			45: 2
		}
	}

	ngOnInit(): void {
		this.cardsGroups = this.cardsService.assignedDaysCardsGroups[this.day.getTime()][this.mechanic.code];
		if (this.cardsService.assignedDaysCardsGroups$[this.day.getTime()][this.mechanic.code]) {
			this.cardsSubscription =
				this.cardsService.assignedDaysCardsGroups$[this.day.getTime()][this.mechanic.code].subscribe((cardUpdate: CardUpdate) => {
					cardUpdate.update(this.cardsGroups);
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

	get hiddenCardsGroup(): CardsGroup {
		return this._hiddenCardsGroup;
	}

	set hiddenCardsGroup(value: CardsGroup) {
		this._hiddenCardsGroup = value;
	}

	get lineHeight$() {
		return this.daysService.lineHeight$;
	}

	get quarterWidth(): number {
		/* El navegador redondea a 2 decimales, por lo que se hace lo mismo que las distancias sean equivalentes */
		return +(this.timeService.intervalWidth * 3).toFixed(2);
	}

	// endregion

	calcScheduleWidth(duration: number): number {
		return this.timeService.calcWidth(duration);
	}

	calcScheduleLeft(start: Date): number {
		return this.timeService.calcLeft(start);
	}

	calcScheduleLineBackground(quarters: number[]): any {
		return `repeating-linear-gradient(
			to right,
			#e1e1e1,
			#e1e1e1 ${this.quarterWidth-this.quarterBackground[quarters[0]]}px,
			#a2a2a2 ${this.quarterWidth-this.quarterBackground[quarters[0]]}px,
			#a2a2a2 ${this.quarterWidth}px,
			#e1e1e1 ${this.quarterWidth}px,
			#e1e1e1 ${this.quarterWidth*2-this.quarterBackground[quarters[1]]}px,
			#a2a2a2 ${this.quarterWidth*2-this.quarterBackground[quarters[1]]}px,
			#a2a2a2 ${this.quarterWidth*2}px,
			#e1e1e1 ${this.quarterWidth*2}px,
			#e1e1e1 ${this.quarterWidth*3-this.quarterBackground[quarters[2]]}px,
			#a2a2a2 ${this.quarterWidth*3-this.quarterBackground[quarters[2]]}px,
			#a2a2a2 ${this.quarterWidth*3}px,
			#e1e1e1 ${this.quarterWidth*3}px,
			#e1e1e1 ${this.quarterWidth*4-this.quarterBackground[quarters[3]]}px,
			#a2a2a2 ${this.quarterWidth*4-this.quarterBackground[quarters[3]]}px,
			#a2a2a2 ${this.quarterWidth*4}px
		)`;

	}

	setHiddenCardsGroup(cardsGroup: CardsGroup): void {
		this.hiddenCardsGroup = cardsGroup;
		this.cdRef.detectChanges();
	}

	checkHideGroup(groupId: number): boolean {
		return this.hiddenCardsGroup ? this.hiddenCardsGroup.id == groupId : false;
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
