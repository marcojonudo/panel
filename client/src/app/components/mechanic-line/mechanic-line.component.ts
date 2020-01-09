import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {CardsService} from "../../services/cards.service";
import {Mechanic} from "../../objects/mechanic";
import {CardsGroup} from "../../objects/cards-group";
import {AppointmentSchedule} from "../../objects/appointment-schedule";
import {Constants} from "../../objects/constants";
import {CardPositionService} from "../../services/card-position.service";
import {MechanicUpdate} from "../../objects/update-days-cards/mechanic-update";
import {DimensionsService} from "../../services/dimensions.service";

@Component({
	selector: 'app-mechanic-line',
	templateUrl: './mechanic-line.component.html',
	styleUrls: ['./mechanic-line.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MechanicLineComponent {

	@Input() day: Date;
	@Input() mechanic: Mechanic;
	@Input() mechanicLineUpdate: MechanicUpdate;
	@Input() maxScheduleWidth: number;
	@Input() appointments: AppointmentSchedule[];

	private _hiddenCardsGroup: CardsGroup;

	private quarterBackground: any;

	constructor(
		private cardsService: CardsService,
		private cardPositionService: CardPositionService,
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

	get quarterWidth(): number {
		/* El navegador redondea a 2 decimales, por lo que se hace lo mismo para que las distancias sean equivalentes */
		return +(DimensionsService.intervalWidth * 3).toFixed(2);
	}

	get assignedDropzoneType(): string {
		return Constants.DROPZONE_TYPE.ASSIGNED;
	}

	get lineDefaultHeight() {
		return Constants.VALUE.LINE_HEIGHT_DEFAULT;
	}

	// endregion

	findGroups(day: Date, mechanicCode: string): CardsGroup[] {
		return this.cardsService.findDayMechanicGroups(day, mechanicCode);
	}

	calcScheduleWidth(duration: number): number {
		return DimensionsService.calcWidthFromDuration(duration);
	}

	calcScheduleLeft(start: Date): number {
		return start ? DimensionsService.calcLeftFromStart(start) : 0;
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
		CardPositionService.hiddenGroup = cardsGroup;
		this.cdRef.detectChanges();
	}

	checkHideGroup(groupId: string): boolean {
		return CardPositionService.hiddenGroup ? CardPositionService.hiddenGroup.id == groupId : false;
	}

	trackByItem(index, item) {
		return item;
	}

	check() {
		if (Constants.CHECK) {
			console.log('checking mechanic line');
		}
	}

}
