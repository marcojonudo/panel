import {Injectable} from '@angular/core';
import {AppointmentSchedule} from "../objects/appointment-schedule";
import {Schedule} from "../objects/schedule";
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

@Injectable({
	providedIn: 'root'
})
export class AppointmentsService {

	private readonly TOTAL: string = 'TOTAL';
	private readonly MAX: string = 'MAX';

	private _appointmentTypes: AppointmentType[];
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

	get appointmentTypes(): AppointmentType[] {
		return this._appointmentTypes;
	}

	set appointmentTypes(value: AppointmentType[]) {
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

	// endregion

	// region Finders

	findAppointmentType(code: string): AppointmentType {
		return this.appointmentTypes.find(appointmentType => appointmentType.code == code);
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
		this.appointmentTypes = appointmentTypes;
		this.appointmentDays = UtilsService.sort(appointmentDays.map(appointmentDay => {
			return new AppointmentDay(appointmentDay.appointmentType, appointmentDay.day, appointmentDay)
		}), (appointmentDay) => appointmentDay.day);

		console.log('Appointment types', this.appointmentTypes);
		console.log('Appointment days', this.appointmentDays);

		this.daysAppointmentsCounter = this.initDaysAppointmentsCounter(this.appointmentDays);
		console.log('Days appointments counter', this.daysAppointmentsCounter);
	}

	// private init

	private initDaysAppointmentsCounter(
		appointmentDays: AppointmentDay[]
	): DaysAppointmentsCounter {
		const daysAppointmentsCounter = {};
		for (let i = 0; i < appointmentDays.length; i = i + 4) {
			daysAppointmentsCounter[appointmentDays[i].day.getTime()] = this.initAppointmentsCounter(
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

	checkSaturation(appointments: number, max: number, appointmentSaturation: number = 1): boolean {
		return appointments > Math.round(max * appointmentSaturation);
	}

	findSaturationPercentage(appointments: number, max: number, appointmentSaturation: number = 1): number {
		return appointments && max ? Math.round((appointments / (max * appointmentSaturation)) * 100) : 0;
	}

	// endregion

	// region Update appointment day

	updateAppointment(
		day: Date,
		cards: Card[],
		add: boolean,
		updateParams: UpdateAppointmentDayParams,
		updateDb: boolean = false,
		daysAppointmentsCounter: DaysAppointmentsCounter = this.daysAppointmentsCounter
	): void {
		if (cards[0].type == Constants.CARD_TYPE.APPOINTMENT) {
			const appointmentDayCounters = daysAppointmentsCounter[day.getTime()];
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

	updateAppointmentType(
		mechanic: Mechanic,
		appointment: AppointmentSchedule,
		newAppointmentTypeCode: string
	): void {
		if (newAppointmentTypeCode) {
			appointment.appointmentType = this.findAppointmentType(newAppointmentTypeCode);

			/* La info se guarda en DB sólo si ya tiene horario. Al definir una nueva cita, y escoger sólo el tipo, no
			*  se guarda para no tener una cita sin horario (aunque sea temporalmente) en DB */
			if (appointment.schedule) {
				this.http.put(Url.appointmentType(), appointment).subscribe();
			}
		} else {
			this.http.delete(
				Url.appointmentType(),
				{params: {id: `${appointment.id}`, mechanicId: `${mechanic.id}`, index: `${appointment.index}`}}
			).subscribe();
			appointment.reset();
		}
		mechanic.appointments = mechanic.appointments.slice();
		NotificationService.notifyMechanicLine(
			Constants.MECHANIC_LINE_UPDATE_TYPE.APPOINTMENT_TYPE,
			mechanic.day,
			mechanic.code
		);
	}

	updateAppointmentSchedule(
		mechanic: Mechanic,
		appointment: AppointmentSchedule,
		type: string,
		start: string,
		end: string
	): void {
		const insertNewAppointment = appointment.schedule == undefined;

		appointment.schedule = type == Constants.SCHEDULE_TYPE.MORNING
			? new Schedule(start, end, undefined, undefined)
			: new Schedule(undefined, undefined, start, end);

		mechanic.appointments = mechanic.appointments.slice();
		if (insertNewAppointment) {
			this.http.post(
				Url.appointmentSchedule(),
				appointment,
				{params: {mechanicId: `${mechanic.id}`}}
			).subscribe((createdAppointment: AppointmentSchedule) => {
				appointment.id = createdAppointment.id;
			});
		} else {
			this.http.put(Url.appointmentSchedule(), appointment).subscribe()
		}
		NotificationService.notifyMechanicLine(
			Constants.MECHANIC_LINE_UPDATE_TYPE.APPOINTMENT_SCHEDULE,
			mechanic.day,
			mechanic.code
		);
	}

	// endregion

}
