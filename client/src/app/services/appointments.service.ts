import {Injectable} from '@angular/core';
import {AppointmentSchedule} from "../objects/appointment-schedule";
import {Constants} from "../objects/constants";
import {HttpClient} from "@angular/common/http";
import {Mechanic} from "../objects/mechanic";
import {AppointmentType} from "../objects/appointment-type";
import {Card} from "../objects/card";
import {AppointmentDay} from "../objects/appointment-day";
import {NotificationService} from "./notification.service";
import {UtilsService} from "./utils.service";
import {DaysAppointmentsCounter} from "../objects/days-appointments-counter";
import {Url} from "../objects/url";
import {UpdateAppointmentDayParams} from "../objects/update-appointment-day-params";
import {DayAppointmentsCounterUpdate} from "../objects/appointments-counter-update/day-appointments-counter-update";
import {ScheduleInterval} from "../objects/schedule-interval";
import {Dayjs} from "dayjs";

@Injectable({
	providedIn: 'root'
})
export class AppointmentsService {

	private readonly TOTAL: string = 'TOTAL';
	private readonly MAX: string = 'MAX';

	private static _dragSchedulesMode: boolean = false;
	private static _dragSchedulesAppointmentType: AppointmentType;

	private static _appointmentTypes: AppointmentType[];
	private appointmentDays: AppointmentDay[];

	private _daysAppointmentsCounter: DaysAppointmentsCounter;
	private _appointmentDaysToUpdate: AppointmentDay[];

	constructor(
		private http: HttpClient
	) {
		this.daysAppointmentsCounter = {};
		this.appointmentDaysToUpdate = [];
	}

	// region Getters / setters

	static get appointmentTypes(): AppointmentType[] {
		return this._appointmentTypes;
	}

	static set appointmentTypes(value: AppointmentType[]) {
		this._appointmentTypes = value;
	}

	get daysAppointmentsCounter(): DaysAppointmentsCounter {
		return this._daysAppointmentsCounter;
	}

	set daysAppointmentsCounter(value: DaysAppointmentsCounter) {
		this._daysAppointmentsCounter = value;
	}

	get appointmentDaysToUpdate(): AppointmentDay[] {
		return this._appointmentDaysToUpdate;
	}

	set appointmentDaysToUpdate(value: AppointmentDay[]) {
		this._appointmentDaysToUpdate = value;
	}

	static get dragSchedulesMode(): boolean {
		return this._dragSchedulesMode;
	}

	static set dragSchedulesMode(value: boolean) {
		this._dragSchedulesMode = value;
	}

	static get dragSchedulesAppointmentType(): AppointmentType {
		return this._dragSchedulesAppointmentType;
	}

	static set dragSchedulesAppointmentType(value: AppointmentType) {
		this._dragSchedulesAppointmentType = value;
	}

	// endregion

	// region Finders

	static findAppointmentType(code: string): AppointmentType {
		return this.appointmentTypes.find((appointmentType: AppointmentType) => appointmentType.code == code);
	}

	findMechanicAppointmentByMechanic(
		dayMechanics: Mechanic[],
		mechanicId: number,
		appointmentIndex: number
	): any[] {
		const mechanic = dayMechanics.find(mechanic => mechanic.id == mechanicId);
		return [mechanic, mechanic.appointments[appointmentIndex]];
	}

	// endregion

	// region Init

	init(
		appointmentTypes: AppointmentType[],
		appointmentDays: any[]
	): void {
		AppointmentsService.appointmentTypes = appointmentTypes;
		this.appointmentDays = UtilsService.sort(
			appointmentDays.map(appointmentDay => new AppointmentDay(appointmentDay)),
			(appointmentDay) => appointmentDay.day
		);
		console.log('Appointment types', AppointmentsService.appointmentTypes);
		console.log('Appointment days', this.appointmentDays);
		this.daysAppointmentsCounter = this.initDaysAppointmentsCounter(this.appointmentDays);
		console.log('Days appointments counter', this.daysAppointmentsCounter);

		AppointmentsService.dragSchedulesAppointmentType = AppointmentsService.appointmentTypes
			.find((appointmentType: AppointmentType) =>
				appointmentType.code == Constants.APPOINTMENT_TYPE_CODE.RAP
			)
	}

	// private init

	private initDaysAppointmentsCounter(appointmentDays: AppointmentDay[]): DaysAppointmentsCounter {
		const daysAppointmentsCounter = {};
		for (let i = 0; i < appointmentDays.length; i = i + 4) {
			daysAppointmentsCounter[appointmentDays[i].day.valueOf()] = this.initAppointmentsCounter(
				appointmentDays.slice(i, i + 4)
			);
		}
		return daysAppointmentsCounter
	}

	private initAppointmentsCounter(appointmentDayTypes: AppointmentDay[]): { [key: string]: AppointmentDay } {
		const appointmentsCounter = {};
		appointmentDayTypes.forEach((appointmentDay: AppointmentDay) => {
			appointmentsCounter[appointmentDay.appointmentType.code] = appointmentDay;
		});
		return appointmentsCounter;
	}

	// endregion

	// region Saturation

	findMax(max: number, appointmentsSaturation): number {
		return Math.round(appointmentsSaturation * max)
	}

	checkSaturation(appointments: number, max: number, appointmentSaturation: number = 1): boolean {
		return appointments > this.findMax(max, appointmentSaturation);
	}

	findSaturationPercentage(appointments: number, max: number, appointmentSaturation: number = 1): number {
		return appointments && max ? Math.round((appointments / this.findMax(max, appointmentSaturation)) * 100) : 0;
	}

	// endregion

	// region Update appointment day

	updateAppointment(
		day: Dayjs,
		cards: Card[],
		add: boolean,
		updateParams: UpdateAppointmentDayParams,
		updateDb: boolean = false,
		daysAppointmentsCounter: DaysAppointmentsCounter = this.daysAppointmentsCounter
	): void {
		if (cards[0].type == Constants.CARD_TYPE.APPOINTMENT) {
			const appointmentDayCounters = daysAppointmentsCounter[day.valueOf()];
			for (const [typeCode, appointmentDay] of Object.entries(appointmentDayCounters)) {
				const typeCards = cards.filter((card: Card) => card.group.appointmentType.code == typeCode);
				typeCards.forEach(card => {
					if (updateParams.updateAll) {
						this.updateAppointmentDay(appointmentDay, card, updateParams.lastDay, add, updateParams.updateTotal);
					} else {
						this.updateAppointmentDayTotal(appointmentDay, add);
					}
					if (this.appointmentDaysToUpdate.indexOf(appointmentDay) == -1) {
						this.appointmentDaysToUpdate.push(appointmentDay);
					}
				});
			}
			NotificationService.notifyAppointmentsCounter(new DayAppointmentsCounterUpdate(day));

			if (updateDb) {
				this.http.put(Url.appointmentsDaysCounters(), this.appointmentDaysToUpdate).subscribe();
				this.appointmentDaysToUpdate = [];
			}
		}
	}

	private updateAppointmentDay(
		appointmentDay: AppointmentDay,
		card: Card,
		lastDay: boolean,
		add: boolean,
		updateTotal: boolean
	): void {
		const [start, end] = lastDay ? [card.lastStart, card.lastEnd] : [card.start, card.end];
		const scheduleType = UtilsService.findScheduleType(start, end);
		appointmentDay[scheduleType] += add ? 1 : -1;
		if (updateTotal) {
			this.updateAppointmentDayTotal(appointmentDay, add);
		}
	}

	private updateAppointmentDayTotal(appointmentDay: AppointmentDay, add: boolean = true): void {
		appointmentDay[Constants.APPOINTMENT_COUNTER_TOTAL] += add ? 1 : -1;
	}

	// endregion

	// region Update max

	addMax(appointmentDay: AppointmentDay): void {
		appointmentDay.max = appointmentDay.max + 1;
		this.updateMaxDb(appointmentDay);
	}

	subtractMax(appointmentDay: any): void {
		if (appointmentDay.max - 1 >= 0) {
			appointmentDay.max = appointmentDay.max - 1 < 0 ? appointmentDay.max : appointmentDay.max - 1;
			this.updateMaxDb(appointmentDay);
		}
	}

	private updateMaxDb(appointmentDay: AppointmentDay): void {
		this.http.put(Url.appointmentDayMax(), appointmentDay).subscribe();
	}

	// endregion

	// region Appointment schedule

	static create(
		mechanic: Mechanic,
		type: AppointmentType,
		start: Dayjs,
		end: Dayjs
	): AppointmentSchedule {
		const newAppointment = new AppointmentSchedule(
			mechanic.day,
			mechanic.code,
			type,
			new ScheduleInterval(start, end)
		);
		mechanic.appointments.push(newAppointment);

		NotificationService.notifyMechanicLine(
			Constants.MECHANIC_LINE_UPDATE_TYPE.APPOINTMENT_SCHEDULE,
			mechanic.day,
			mechanic.code
		);

		return newAppointment;
	}

	static updateSchedule(
		mechanic: Mechanic,
		appointment: AppointmentSchedule,
		start: Dayjs,
		end: Dayjs
	): void {
		const appointmentSchedule = mechanic.appointments.find((appointmentSchedule: AppointmentSchedule) =>
			appointmentSchedule.equals(appointment)
		);
		appointmentSchedule.schedule.start = start;
		appointmentSchedule.schedule.setEnd(end);

		NotificationService.notifyMechanicLine(
			Constants.MECHANIC_LINE_UPDATE_TYPE.APPOINTMENT_SCHEDULE,
			mechanic.day,
			mechanic.code
		);
	}

	static delete(
		mechanic: Mechanic,
		appointment: AppointmentSchedule
	): void {
		const appointmentIndex = mechanic.appointments.findIndex((appointmentSchedule: AppointmentSchedule) =>
			appointmentSchedule.equals(appointment)
		);
		mechanic.appointments.splice(appointmentIndex, 1);

		NotificationService.notifyMechanicLine(
			Constants.MECHANIC_LINE_UPDATE_TYPE.APPOINTMENT_SCHEDULE,
			mechanic.day,
			mechanic.code
		);
	}

	createDb(appointment: AppointmentSchedule): void {
		this.http.post(Url.appointment(), appointment).subscribe();
	}

	updateDb(appointment: AppointmentSchedule): void {
		this.http.patch(Url.appointmentSchedule(), appointment).subscribe();
	}

	deleteDb(appointment: AppointmentSchedule): void {
		const [mechanicCode, day, typeCode, start] = [
			appointment.mechanicCode,
			appointment.day.format(Constants.DATE_FORMAT.yyyy_MM_dd),
			appointment.appointmentType.code,
			appointment.schedule.start.format(Constants.TIME_FORMAT.HH_mm)
		];
		const params = `?start=${start}&day=${day}&mechanicCode=${mechanicCode}&typeCode=${typeCode}`;
		this.http.delete(`${Url.appointment()}${params}`).subscribe();
	}

	// endregion

	static toggleDragSchedulesMode(): void {
		this.dragSchedulesMode = !this.dragSchedulesMode;
		NotificationService.notifyMainCursor(
			this.dragSchedulesMode ? Constants.MAIN_CURSOR.DRAGGING_SCHEDULES : Constants.MAIN_CURSOR.DEFAULT
		);
	}

}
