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
import {MechanicsService} from "../../services/mechanics.service";
import {DragScheduleBehaviour} from "../../objects/drag-schedule-behaviour/drag-schedule-behaviour";
import {UpdateScheduleBehaviour} from "../../objects/drag-schedule-behaviour/update-schedule-behaviour";
import {CreateScheduleBehaviour} from "../../objects/drag-schedule-behaviour/create-schedule-behaviour";
import {AppointmentsService} from "../../services/appointments.service";
import {Dayjs} from "dayjs";

@Component({
	selector: 'app-mechanic-line',
	templateUrl: './mechanic-line.component.html',
	styleUrls: ['./mechanic-line.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MechanicLineComponent {

	@Input() day: Dayjs;
	@Input() mechanic: Mechanic;
	@Input() mechanicLineUpdate: MechanicUpdate;
	// @Input() maxScheduleWidth: number;
	@Input() appointments: AppointmentSchedule[];
	@Input() showAppointmentsName: boolean;

	constructor(
		private cardsService: CardsService,
		private mechanicsService: MechanicsService,
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

	get redColor(): string {
		return 'red';
	}

	// endregion

	findGroups(day: Dayjs, mechanicCode: string): CardsGroup[] {
		return CardsService.findDayMechanicGroups(day, mechanicCode);
	}

	calcScheduleWidth(duration: number): number {
		return DimensionsService.calcWidthFromDuration(duration);
	}

	calcScheduleHeight(lines: number): number {
		return lines * Constants.VALUE.LINE_HEIGHT_DEFAULT;
	}

	calcScheduleLeft(start: Dayjs): number {
		return start ? DimensionsService.calcLeftFromStart(start) : 0;
	}

	checkStartHourQuarter(quarter: number): boolean {
		return quarter == 0;
	}

	findJobLineTypeColor(code: string): string {
		return JobLineTypeService.findJobLineTypeColor(code);
	}

	findScheduleLeftBorderBackground(color: string): string {
		color = Constants.SCHEDULE_BORDER_COLOR[color] || color;
		return `linear-gradient(${color} 5px, transparent 5px, transparent, transparent calc(100% - 5px), ${color} calc(100% - 5px)) center/100% auto no-repeat, #f1f1f1 linear-gradient(90deg, ${color}, ${color} 5px, transparent 5px, transparent) center/100% auto no-repeat`;
	}

	findScheduleRightBorderBackground(color: string): string {
		color = Constants.SCHEDULE_BORDER_COLOR[color] || color;
		return `linear-gradient(${color} 5px, transparent 5px, transparent, transparent calc(100% - 5px), ${color} calc(100% - 5px)) center/100% auto no-repeat, #f1f1f1 linear-gradient(90deg, transparent, transparent 5px, ${color} 5px, ${color}) center/100% auto no-repeat`;
	}

	findCursor(): string {
		return AppointmentsService.dragSchedulesMode
			? Constants.SCHEDULE_BORDER_CURSOR.E_RESIZE
			: Constants.SCHEDULE_BORDER_CURSOR.DEFAULT;
	}

	checkShowAppointmentStartSquareBracket(scheduleIntervals: ScheduleInterval[], appointmentStart: Dayjs): boolean {
		return scheduleIntervals.find((interval: ScheduleInterval) =>
			interval.start.isSame(appointmentStart)
		) == undefined;
	}

	checkShowAppointmentEndSquareBracket(scheduleIntervals: ScheduleInterval[], appointmentEnd: Dayjs): boolean {
		return scheduleIntervals.find((interval: ScheduleInterval) =>
			interval.end.isSame(appointmentEnd)
		) == undefined;
	}

	setHiddenCardsGroup(cardsGroup: CardsGroup): void {
		CardPositionService.hiddenGroup = cardsGroup;
		this.cdRef.detectChanges();
	}

	checkHideGroup(groupId: string): boolean {
		return CardPositionService.hiddenGroup ? CardPositionService.hiddenGroup.id == groupId : false;
	}

	checkUpdateDropzone(mechanicLineUpdate: MechanicUpdate = this.mechanicLineUpdate): MechanicUpdate {
		return mechanicLineUpdate && mechanicLineUpdate.type == Constants.MECHANIC_LINE_UPDATE_TYPE.MAX_SCHEDULE_WIDTH
			? mechanicLineUpdate : undefined;
	}

	createCreateScheduleBehaviour(): DragScheduleBehaviour {
		return new CreateScheduleBehaviour();
	}

	createUpdateScheduleBehaviour(left: boolean): DragScheduleBehaviour {
		return new UpdateScheduleBehaviour(left);
	}

	trackByItem(index, item) {
		return item;
	}

	check() {
		if (Constants.CHECK) {
			console.log('checking mechanic line', this.mechanicLineUpdate, this.mechanic);
		}
	}

}
