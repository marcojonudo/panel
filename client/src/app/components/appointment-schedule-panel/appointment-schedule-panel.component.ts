import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {AppointmentSchedule} from "../../objects/appointment-schedule";
import {Constants} from "../../objects/constants";
import {CommonService} from "../../services/common.service";
import {AppointmentType} from "../../objects/appointment-type";
import {UtilsService} from "../../services/utils.service";
import {Observable} from "rxjs/internal/Observable";
import {Subject} from "rxjs/internal/Subject";
import {DragScheduleInfo} from "../../objects/drag-schedule-info";
import {Schedule} from "../../objects/schedule";
import {AppointmentsService} from "../../services/appointments.service";
import {Mechanic} from "../../objects/mechanic";
import {HourQuarters} from "../../objects/hour-quarters";
import {DragScheduleAction} from "../../objects/drag-schedule/drag-schedule-action";

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

	private appointmentTypeScheduleSubject: Subject<DragScheduleAction>;
	private _appointmentTypeSchedule$: Observable<DragScheduleAction>;

	private QUARTERS: number[] = [0, 15, 30, 45];
	private dragTypeSchedule: any;

	constructor(
		private appointmentsService: AppointmentsService,
		private cdRef: ChangeDetectorRef
	) {
		this.dragTypeSchedule = {};
		this.dragTypeSchedule[Constants.SCHEDULE_TYPE.MORNING] = [];
		this.dragTypeSchedule[Constants.SCHEDULE_TYPE.AFTERNOON] = [];

		this.appointmentTypeScheduleSubject = new Subject<DragScheduleAction>();
		this.appointmentTypeSchedule$ = this.appointmentTypeScheduleSubject.asObservable();

		this.appointmentTypeSchedule$.subscribe((action: DragScheduleAction) => {
			action.update(this.dragTypeSchedule[action.dragInfo.type]);
			this.cdRef.detectChanges();
		});
	}

	ngOnInit(): void {
		this.appointments = this.mechanic.appointments;
		/* Al abrir el popup, es posible que el mecánico ya tenga horario de citas asignado. Si es así, se carga para
		*  que se muestre */
		this.appointments.forEach((appointment: AppointmentSchedule) => {
			if (appointment.schedule) {
				appointment.schedule.intervals[0].hourQuarters.forEach((hourQuarters: HourQuarters) => {
					hourQuarters.quarters.forEach(quarter => {
						this.dragTypeSchedule[appointment.schedule.type.toLowerCase()].push(
							new DragScheduleInfo(hourQuarters.hour, quarter, hourQuarters.type)
						);
					});
				});
			}
		});
	}

	// region Getters / setters

	get appointments(): AppointmentSchedule[] {
		return this._appointmentsSchedules;
	}

	set appointments(value: AppointmentSchedule[]) {
		this._appointmentsSchedules = value;
	}

	get appointmentTypeSchedule$(): Observable<DragScheduleAction> {
		return this._appointmentTypeSchedule$;
	}

	set appointmentTypeSchedule$(value: Observable<DragScheduleAction>) {
		this._appointmentTypeSchedule$ = value;
	}

	get appointmentTypes(): AppointmentType[] {
		return this.appointmentsService.appointmentTypes.filter(appointmentType => appointmentType.workingLine);
	}

	get quarters(): number[] {
		return this.QUARTERS;
	}

	get lineDefaultHeight(): number {
		return Constants.VALUE.LINE_HEIGHT_DEFAULT;
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

	isQuarterDisabled(quarter: number, quarters: number[]): boolean {
		return quarters.find(q => q == quarter) == undefined;
	}

	isScheduleSelected(hour: number, quarter: number, type: string): boolean {
		return this.dragTypeSchedule[type].find(s => s.hour == hour && s.quarter == quarter) != undefined;
	}

	updateAppointmentType(appointment: AppointmentSchedule, newAppointmentTypeCode: string): void {
		if (!newAppointmentTypeCode) {
			this.dragTypeSchedule[appointment.schedule.type] = []
		}
		this.appointmentsService.updateAppointmentType(this.mechanic, appointment, newAppointmentTypeCode);
		this.cdRef.detectChanges();
	}

	updateAppointmentSchedule(
		appointment: AppointmentSchedule,
		index: number,
		scheduleType: string,
		schedule: Schedule = this.mechanic.schedule
	): void {
		/* Se filtra la información de los horarios para que no se guarden datos fuera de los límites */
		this.dragTypeSchedule[scheduleType] = this.dragTypeSchedule[scheduleType].filter((dragInfo: DragScheduleInfo) => {
			const time = UtilsService.parseTimeFromMinutes(dragInfo.hour*Constants.HOUR_MINUTES + dragInfo.quarter, new Date());
			return schedule.intervals[index].start <= time && time < schedule.intervals[index].end
		});

		const [start, end] = [
			`${this.dragTypeSchedule[scheduleType][0].hour}:${this.dragTypeSchedule[scheduleType][0].quarter}:00`,
			`${this.dragTypeSchedule[scheduleType][this.dragTypeSchedule[scheduleType].length - 1].hour}:${this.dragTypeSchedule[scheduleType][this.dragTypeSchedule[scheduleType].length - 1].quarter + Constants.QUARTERS.STEP_15}:00`
		];

		this.appointmentsService.updateAppointmentSchedule(
			this.mechanic,
			appointment,
			scheduleType,
			start,
			end
		);
	}

	check() {
		if (Constants.CHECK) {
			console.log('checking appointment schedule panel', this.appointments)
		}
	}

}
