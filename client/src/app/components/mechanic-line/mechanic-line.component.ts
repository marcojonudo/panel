import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {TimeService} from "../../services/time.service";
import {CardsService} from "../../services/cards.service";
import {Mechanic} from "../../objects/mechanic";
import {DaysService} from "../../services/days.service";
import {CardsGroup} from "../../objects/cards-group";
import {UnassignedCardUpdate} from "../../objects/update-cards/unassigned-card-update";
import {AppointmentSchedule} from "../../objects/appointment-schedule";
import {Constants} from "../../objects/constants";
import {Subscription} from "rxjs/internal/Subscription";
import {CardPositionService} from "../../services/card-position.service";
import {MechanicLineUpdate} from "../../objects/update-days-cards/mechanic-line-update";

@Component({
	selector: 'app-mechanic-line',
	templateUrl: './mechanic-line.component.html',
	styleUrls: ['./mechanic-line.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MechanicLineComponent {

	@Input() day: Date;
	@Input() mechanic: Mechanic;
	@Input() dayCardUpdate: MechanicLineUpdate;
	@Input() appointments: AppointmentSchedule[];
	@Input() maxScheduleHours: number[];
	@Input() maxScheduleWidth: number;

	private _hiddenCardsGroup: CardsGroup;

	private quarterBackground: any;

	constructor(
		private timeService: TimeService,
		private cardsService: CardsService,
		private cardPositionService: CardPositionService,
		private daysService: DaysService,
		private cdRef: ChangeDetectorRef
	) {
		this.quarterBackground = {
			0: 1,
			15: 1,
			30: 1,
			45: 2
		}
	}

	// region Getters / setters

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
		/* El navegador redondea a 2 decimales, por lo que se hace lo mismo para que las distancias sean equivalentes */
		return +(this.timeService.intervalWidth * 3).toFixed(2);
	}

	get assignedDropzoneType(): string {
		return Constants.DROPZONE_TYPE.ASSIGNED;
	}

	// endregion

	findGroups(day: Date, mechanicCode: string): CardsGroup[] {
		return this.cardsService.getAssignedCardsGroups(day, mechanicCode);
	}

	calcScheduleWidth(duration: number): number {
		return this.timeService.calcWidthFromDuration(duration);
	}

	calcScheduleLeft(start: Date): number {
		return start ? this.timeService.calcLeftFromStart(start) : 0;
	}

	calcScheduleLineBackground(quarters: number[]): any {
		return `repeating-linear-gradient(
			to right,
			rgb(225, 225, 225, .5),
			rgb(225, 225, 225, .5) ${this.quarterWidth-this.quarterBackground[quarters[0]]}px,
			#a2a2a2 ${this.quarterWidth-this.quarterBackground[quarters[0]]}px,
			#a2a2a2 ${this.quarterWidth}px,
			rgb(225, 225, 225, .5) ${this.quarterWidth}px,
			rgb(225, 225, 225, .5) ${this.quarterWidth*2-this.quarterBackground[quarters.length > 1 ? quarters[1] : (quarters[0] + 15)%60]}px,
			#a2a2a2 ${this.quarterWidth*2-this.quarterBackground[quarters.length > 1 ? quarters[1] : (quarters[0] + 15)%60]}px,
			#a2a2a2 ${this.quarterWidth*2}px,
			rgb(225, 225, 225, .5) ${this.quarterWidth*2}px,
			rgb(225, 225, 225, .5) ${this.quarterWidth*3-this.quarterBackground[quarters.length > 2 ? quarters[2] : (quarters[0] + 15*2)%60]}px,
			#a2a2a2 ${this.quarterWidth*3-this.quarterBackground[quarters.length > 2 ? quarters[2] : (quarters[0] + 15*2)%60]}px,
			#a2a2a2 ${this.quarterWidth*3}px,
			rgb(225, 225, 225, .5) ${this.quarterWidth*3}px,
			rgb(225, 225, 225, .5) ${this.quarterWidth*4-this.quarterBackground[quarters.length > 3 ? quarters[3] : (quarters[0] + 15*3)%60]}px,
			#a2a2a2 ${this.quarterWidth*4-this.quarterBackground[quarters.length > 3 ? quarters[3] : (quarters[0] + 15*3)%60]}px,
			#a2a2a2 ${this.quarterWidth*4}px
		)`;
	}

	setHiddenCardsGroup(cardsGroup: CardsGroup): void {
		this.cardPositionService.hiddenGroup = cardsGroup;
		this.cdRef.detectChanges();
	}

	checkHideGroup(groupId: number): boolean {
		return this.cardPositionService.hiddenGroup ? this.cardPositionService.hiddenGroup.id == groupId : false;
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
