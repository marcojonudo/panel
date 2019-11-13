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

@Component({
	selector: 'app-appointment-schedule-panel',
	templateUrl: './appointment-schedule-panel.component.html',
	styleUrls: ['./appointment-schedule-panel.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppointmentSchedulePanelComponent implements OnInit {

	@Input() schedule: Schedule;
	@Input() appointmentsSchedules: AppointmentSchedule[];

	private appointmentTypeScheduleSubject: Subject<AppointmentTypeScheduleDragInfo[]>;
	private dragTypeSchedule: any;

	constructor(
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

	private _appointmentTypeSchedule$: Observable<AppointmentTypeScheduleDragInfo[]>;

	get appointmentTypeSchedule$(): Observable<AppointmentTypeScheduleDragInfo[]> {
		return this._appointmentTypeSchedule$;
	}

	// region Getters / setters

	set appointmentTypeSchedule$(value: Observable<AppointmentTypeScheduleDragInfo[]>) {
		this._appointmentTypeSchedule$ = value;
	}

	get appointmentTypes(): AppointmentType[] {
		return this.commonService.appointmentTypes;
	}

	ngOnInit(): void {
		/* Al abrir el popup, es posible que el mecánico ya tenga horario de citas asignado. Si es así, se carga para
		*  que se muestre */
		this.appointmentsSchedules.forEach(appointmentSchedule => {
			const quarters = appointmentSchedule.schedule.quarters[0];
			let startQuarterIndex = 0;
			appointmentSchedule.schedule.hours[0].forEach(hour => {
				const endQuarterIndex = quarters.slice(startQuarterIndex).indexOf(Constants.QUARTERS.STEP_45);
				for (let i = startQuarterIndex; i < endQuarterIndex + 1; i++) {
					this.dragTypeSchedule[appointmentSchedule.schedule.type].push(
						new AppointmentTypeScheduleDragInfo(hour, quarters[i], appointmentSchedule.schedule.type)
					);
				}
			});
		});
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

	addAppointmentType(code: string): void {
		console.log(code);
	}

	check() {
		if (Constants.CHECK) {
			console.log('checking appointment schedule panel', this.appointmentsSchedules)
		}
	}

}
