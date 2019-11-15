import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {AppointmentSchedule} from "../../objects/appointment-schedule";
import {Constants} from "../../objects/constants";
import {CommonService} from "../../services/common.service";
import {AppointmentType} from "../../objects/appointment-type";
import {UtilsService} from "../../services/utils.service";
import {Observable} from "rxjs/internal/Observable";
import {Subject} from "rxjs/internal/Subject";
import {AppointmentTypeScheduleDragInfo} from "../../objects/appointment-type-schedule-drag-info";
import {Schedule} from "../../objects/schedule";
import {AppointmentsService} from "../../services/appointments.service";
import {Mechanic} from "../../objects/mechanic";

@Component({
	selector: 'app-appointment-schedule-panel',
	templateUrl: './appointment-schedule-panel.component.html',
	styleUrls: ['./appointment-schedule-panel.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppointmentSchedulePanelComponent implements OnInit {

	@Input() schedule: Schedule;
	@Input() mechanic: Mechanic;

	private _appointmentsSchedules: AppointmentSchedule[];

	private appointmentTypeScheduleSubject: Subject<AppointmentTypeScheduleDragInfo[]>;
	private _appointmentTypeSchedule$: Observable<AppointmentTypeScheduleDragInfo[]>;

	private dragTypeSchedule: any;

	constructor(
		private appointmentsService: AppointmentsService,
		private commonService: CommonService,
		private cdRef: ChangeDetectorRef
	) {
		this.dragTypeSchedule = {};
		this.dragTypeSchedule[Constants.SCHEDULE_TYPE.MORNING] = [];
		this.dragTypeSchedule[Constants.SCHEDULE_TYPE.AFTERNOON] = [];

		this.appointmentTypeScheduleSubject = new Subject<AppointmentTypeScheduleDragInfo[]>();
		this.appointmentTypeSchedule$ = this.appointmentTypeScheduleSubject.asObservable();

		this.appointmentTypeSchedule$.subscribe((dragSchedule: AppointmentTypeScheduleDragInfo[]) => {
			this.dragTypeSchedule[dragSchedule[0].type] = dragSchedule;
			this.cdRef.detectChanges();
		});
	}

	ngOnInit(): void {
		this.appointmentsSchedules = this.mechanic.appointments;
		/* Al abrir el popup, es posible que el mecánico ya tenga horario de citas asignado. Si es así, se carga para
		*  que se muestre */
		this.appointmentsSchedules.forEach(appointmentSchedule => {
			let startQuarterIndex = 0;
			appointmentSchedule.schedule.hoursArray[0].forEach(hour => {
				const quarters = appointmentSchedule.schedule.quarters[0].slice(startQuarterIndex);
				const endQuarterIndex = quarters.indexOf(Constants.QUARTERS.STEP_45);
				const endIndex = endQuarterIndex != -1 ? endQuarterIndex + 1: quarters.length;
				for (let i = 0; i < endIndex; i++) {
					this.dragTypeSchedule[appointmentSchedule.schedule.type].push(
						new AppointmentTypeScheduleDragInfo(hour, quarters[i], appointmentSchedule.schedule.type)
					);
				}
				startQuarterIndex += endQuarterIndex+1;
			});
		});
	}

	// region Getters / setters

	get appointmentsSchedules(): AppointmentSchedule[] {
		return this._appointmentsSchedules;
	}

	set appointmentsSchedules(value: AppointmentSchedule[]) {
		this._appointmentsSchedules = value;
	}

	get appointmentTypeSchedule$(): Observable<AppointmentTypeScheduleDragInfo[]> {
		return this._appointmentTypeSchedule$;
	}

	set appointmentTypeSchedule$(value: Observable<AppointmentTypeScheduleDragInfo[]>) {
		this._appointmentTypeSchedule$ = value;
	}

	get appointmentTypes(): AppointmentType[] {
		return this.commonService.appointmentTypes;
	}

	// endregion

	getScheduleType(type: string, index: number): string {
		return (type == Constants.SCHEDULE_TYPE.FULL_TIME && index == 0) || type == Constants.SCHEDULE_TYPE.MORNING
			? Constants.SCHEDULE_TYPE.MORNING
			: Constants.SCHEDULE_TYPE.AFTERNOON;
	}

	getScheduleTypeName(type: string, index: number): string {
		return this.getScheduleType(type, index) == Constants.SCHEDULE_TYPE.MORNING ? 'Mañana' : 'Tarde';
	}

	findHourQuarters(quarters: number[]): number[] {
		const offset = quarters[0] / 15;
		const index = quarters.indexOf(45);
		const filledQuarters = quarters.slice(0, index + 1);
		filledQuarters.splice(0, 0, ...UtilsService.createArray(offset).map(() => undefined));
		return filledQuarters;
	}

	isScheduleSelected(hour: number, quarter: number, type: string): boolean {
		return this.dragTypeSchedule[type].find(s => s.hour == hour && s.quarter == quarter && s.type == type) != undefined;
	}

	updateAppointmentType(index: number, appointmentTypeCode: string): void {
		this.appointmentsService.updateAppointmentType(this.mechanic, this.appointmentsSchedules, index, appointmentTypeCode);
		this.cdRef.detectChanges();
	}

	updateAppointmentSchedule(index: number, scheduleType: string): void {
		this.appointmentsService.updateAppointmentSchedule(
			this.mechanic,
			this.appointmentsSchedules,
			index,
			scheduleType,
			this.dragTypeSchedule[scheduleType]
		);
	}

	check() {
		if (Constants.CHECK) {
			console.log('checking appointment schedule panel', this.appointmentsSchedules)
		}
	}

}
