import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {AppointmentSchedule} from "../../objects/appointment-schedule";
import {Constants} from "../../objects/constants";
import {CommonService} from "../../services/common.service";
import {AppointmentType} from "../../objects/appointment-type";
import {UtilsService} from "../../services/utils.service";
import {Skill} from "../../objects/skill";
import {Observable} from "rxjs/internal/Observable";
import {Subject} from "rxjs/internal/Subject";
import {AppointmentTypeScheduleDragInfo} from "../../objects/appointment-type-schedule-drag-info";

@Component({
	selector: 'app-appointment-schedule-panel',
	templateUrl: './appointment-schedule-panel.component.html',
	styleUrls: ['./appointment-schedule-panel.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppointmentSchedulePanelComponent {

	@Input() appointmentsSchedules: AppointmentSchedule[];

	private appointmentTypeScheduleSubject: Subject<AppointmentTypeScheduleDragInfo[]>;
	private _appointmentTypeSchedule$: Observable<AppointmentTypeScheduleDragInfo[]>;

	private dragInfo: AppointmentTypeScheduleDragInfo;
	private dragSchedule: AppointmentTypeScheduleDragInfo[];

	constructor(
		private commonService: CommonService,
		private cdRef: ChangeDetectorRef
	) {
		this.dragInfo = new AppointmentTypeScheduleDragInfo(0, 0);
		this.dragSchedule = [];

		this.appointmentTypeScheduleSubject = new Subject<AppointmentTypeScheduleDragInfo[]>();
		this.appointmentTypeSchedule$ = this.appointmentTypeScheduleSubject.asObservable();

		this.appointmentTypeSchedule$.subscribe((dragSchedule: AppointmentTypeScheduleDragInfo[]) => {
			this.dragSchedule = dragSchedule;
			this.cdRef.detectChanges();
		})
	}

	// region Getters / setters

	get appointmentTypes(): AppointmentType[] {
		return this.commonService.appointmentTypes;
	}

	get appointmentTypeSchedule$(): Observable<AppointmentTypeScheduleDragInfo[]> {
		return this._appointmentTypeSchedule$;
	}

	set appointmentTypeSchedule$(value: Observable<AppointmentTypeScheduleDragInfo[]>) {
		this._appointmentTypeSchedule$ = value;
	}

	// endregion

	getScheduleTypeName(type: string): string {
		return type == Constants.SCHEDULE_TYPE.MORNING ? 'Mañana' : 'Tarde';
	}

	findHourQuarters(quarters: number[], hourIndex: number): number[] {
		const offset = quarters[0] / 15;
		const index = quarters.indexOf(45);
		const filledQuarters = quarters.slice(0, index+1);
		filledQuarters.splice(0, 0, ...UtilsService.createArray(offset).map(() => undefined));
		return filledQuarters;
	}

	isScheduleSelected(hour: number, quarter: number): boolean {
		return this.dragSchedule.find(s => s.hour == hour && s.quarter == quarter) != undefined;
		// return hour == this.dragInfo.hour && quarter == this.dragInfo.quarter;
	}

	addAppointmentType(code: string): void {
		console.log(code);
	}

	check() {
		if (Constants.CHECK) {
			console.log('checking appointment schedule panel', this.appointmentsSchedules)
		}
	}

}
