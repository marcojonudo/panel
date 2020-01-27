import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {CardsService} from "../../services/cards.service";
import {Mechanic} from "../../objects/mechanic";
import {CardsGroup} from "../../objects/cards-group";
import {AppointmentSchedule} from "../../objects/appointment-schedule";
import {Constants} from "../../objects/constants";
import {CardPositionService} from "../../services/card-position.service";
import {MechanicUpdate} from "../../objects/update-days-cards/mechanic-update";
import {DimensionsService} from "../../services/dimensions.service";
import {JobLineTypeService} from "../../services/job-line-type.service";
import {ScheduleInterval} from "../../objects/schedule-interval";

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

	constructor(
		private cardsService: CardsService,
		private cardPositionService: CardPositionService,
		private jobLineTypeService: JobLineTypeService,
		private cdRef: ChangeDetectorRef
	) {}

	// region Getters / setters

	get assignedDropzoneType(): string {
		return Constants.DROPZONE_TYPE.ASSIGNED;
	}

	get lineDefaultHeight(): number {
		return Constants.VALUE.LINE_HEIGHT_DEFAULT;
	}

	get jobLineTypeHeight(): number {
		return Constants.VALUE.JOB_LINE_TYPE_HEIGHT;
	}

	// endregion

	findGroups(day: Date, mechanicCode: string): CardsGroup[] {
		return this.cardsService.findDayMechanicGroups(day, mechanicCode);
	}

	calcScheduleWidth(duration: number): number {
		return DimensionsService.calcWidthFromDuration(duration);
	}

	calcScheduleHeight(lines: number): number {
		return lines * Constants.VALUE.LINE_HEIGHT_DEFAULT;
	}

	calcScheduleLeft(start: Date): number {
		return start ? DimensionsService.calcLeftFromStart(start) : 0;
	}

	checkStartHourQuarter(quarter: number): boolean {
		return quarter == 0;
	}

	findJobLineTypeColor(code: string): string {
		return this.jobLineTypeService.findJobLineTypeColor(code);
	}

	findScheduleLeftBorderBackground(color: string): string {
		return `linear-gradient(${color} 5px, transparent 5px, transparent, transparent calc(100% - 5px), ${color} calc(100% - 5px)) center/100% auto no-repeat, linear-gradient(90deg, ${color}, ${color} 5px, transparent 5px, transparent) center/100% auto no-repeat`;
	}

	findScheduleRightBorderBackground(color: string): string {
		return `linear-gradient(${color} 5px, transparent 5px, transparent, transparent calc(100% - 5px), ${color} calc(100% - 5px)) center/100% auto no-repeat, linear-gradient(90deg, transparent, transparent 5px, ${color} 5px, ${color}) center/100% auto no-repeat`;
	}

	checkShowAppointmentStartSquareBracket(scheduleIntervals: ScheduleInterval[], appointmentStart: Date): boolean {
		return scheduleIntervals.find((interval: ScheduleInterval) =>
			interval.start.getTime() == appointmentStart.getTime()
		) == undefined;
	}

	checkShowAppointmentEndSquareBracket(scheduleIntervals: ScheduleInterval[], appointmentEnd: Date): boolean {
		return scheduleIntervals.find((interval: ScheduleInterval) =>
			interval.end.getTime() == appointmentEnd.getTime()
		) == undefined;
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
			console.log('checking mechanic line', this.mechanicLineUpdate);
		}
	}

}
