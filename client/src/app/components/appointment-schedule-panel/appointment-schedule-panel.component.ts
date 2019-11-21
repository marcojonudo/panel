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
		private commonService: CommonService,
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
		this.appointmentsSchedules = this.mechanic.appointments;
		/* Al abrir el popup, es posible que el mecánico ya tenga horario de citas asignado. Si es así, se carga para
		*  que se muestre */
		this.appointmentsSchedules.forEach(appointmentSchedule => {
			appointmentSchedule.schedule.hourQuarters[0].forEach((hourQuarters: HourQuarters) => {
				hourQuarters.quarters.forEach(quarter => {
					this.dragTypeSchedule[appointmentSchedule.schedule.type].push(
						new DragScheduleInfo(hourQuarters.hour, quarter, hourQuarters.type)
					);
				});
			});
		});

		if (this.mechanic.schedule.type == Constants.SCHEDULE_TYPE.FULL_TIME &&
				this.appointmentsSchedules.length == 1 &&
				this.appointmentsSchedules[0].schedule.type == Constants.SCHEDULE_TYPE.AFTERNOON) {
			this.appointmentsSchedules.unshift(undefined);
		}
	}

	// region Getters / setters

	get appointmentsSchedules(): AppointmentSchedule[] {
		return this._appointmentsSchedules;
	}

	set appointmentsSchedules(value: AppointmentSchedule[]) {
		this._appointmentsSchedules = value;
	}

	get appointmentTypeSchedule$(): Observable<DragScheduleAction> {
		return this._appointmentTypeSchedule$;
	}

	set appointmentTypeSchedule$(value: Observable<DragScheduleAction>) {
		this._appointmentTypeSchedule$ = value;
	}

	get appointmentTypes(): AppointmentType[] {
		return this.commonService.appointmentTypes;
	}

	get quarters(): number[] {
		return this.QUARTERS;
	}

	// endregion

	findAppointmentSchedule(scheduleType: string, index: number): AppointmentSchedule {
		const type = this.getScheduleType(scheduleType, index);
		return this.appointmentsSchedules.find(appointment => appointment && appointment.schedule.type == type);
	}

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

	updateAppointmentType(index: number, appointmentTypeCode: string): void {
		this.appointmentsService.updateAppointmentType(this.mechanic, this.appointmentsSchedules, index, appointmentTypeCode);
		this.cdRef.detectChanges();
	}

	updateAppointmentSchedule(index: number, scheduleType: string): void {
		/* Se filtra la información de los horarios para que no se guarden datos fuera de los límites.
		*  Al sólo haber horarios de mañana o tarde en citas (para poder definir tipos de citas distintos), no hace
		*  falta comprobar si es full_time. Si es de tarde y hay mañana, thresholds tendrá longitud 4, siendo de tarde
		*  los 2 últimos elementos. Si es de tarde pero no hay mañana, o es mañana, se cogen los 2 primeros */
		const thresholds = scheduleType == Constants.SCHEDULE_TYPE.AFTERNOON && this.mechanic.schedule.morningStart
			? this.mechanic.schedule.thresholds.slice(2) : this.mechanic.schedule.thresholds.slice(0, 2);
		this.dragTypeSchedule[scheduleType] = this.dragTypeSchedule[scheduleType].filter((dragInfo: DragScheduleInfo) => {
			const time = UtilsService.parseTimeFromMinutes(dragInfo.hour*Constants.HOUR_MINUTES + dragInfo.quarter, new Date());
			return thresholds[0] <= time && time < thresholds[1]
		});

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
