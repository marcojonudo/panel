import {Injectable} from '@angular/core';
import {AppointmentSchedule} from "../objects/appointment-schedule";
import {CommonService} from "./common.service";
import {Schedule} from "../objects/schedule";
import {Constants} from "../objects/constants";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Mechanic} from "../objects/mechanic";
import {CardsGroup} from "../objects/cards-group";
import {AppointmentType} from "../objects/appointment-type";
import {Card} from "../objects/card";
import {AppointmentDay} from "../objects/appointment-day";
import {NotificationService} from "./notification.service";
import {UtilsService} from "./utils.service";
import {DaysAppointmentsCounter} from "../objects/days-appointments-counter";
import {Url} from "../objects/url";
import {AppointmentsCounterUpdateTrigger} from "../objects/update-appointments-counter/appointments-counter-update-trigger";
import {DaysAssignedGroups} from "../objects/days-assigned-groups";
import {UpdateAppointmentDayParams} from "../objects/update-appointment-day-params";

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

	// endregion

	// region Init

	init(
		appointmentTypes: AppointmentType[],
		appointmentDays: any[],
		assignedDaysGroups: DaysAssignedGroups,
		unassignedGroups: CardsGroup[]
	): void {
		this.appointmentTypes = appointmentTypes;
		this.appointmentDays = appointmentDays.map(appointmentDay => {
			return new AppointmentDay(appointmentDay.appointmentType, appointmentDay.day, appointmentDay)
		});

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
			)
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

	// region Update appointment day

	updateAppointment(
		day: Date,
		cards: Card[],
		add: boolean,
		updateParams: UpdateAppointmentDayParams,
		updateDb: boolean = false,
		daysAppointmentsCounter: DaysAppointmentsCounter = this.daysAppointmentsCounter
	): void {
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
		NotificationService.notifyAppointmentsCounter(new AppointmentsCounterUpdateTrigger(day, cards));

		if (updateDb) {
			this.http.put(Url.updateAppointmentsDays(), this.appointmentDaysToUpdate).subscribe();
			this.appointmentDaysToUpdate = [];
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

	// endregion

	private updateAppointmentDayTotal(appointmentDay: AppointmentDay, add: boolean = true): void {
		appointmentDay[Constants.APPOINTMENT_COUNTER_TOTAL] += add ? 1 : -1;
	}

	updateMaxDb(appointmentDay: AppointmentDay, day: Date): void {
		if (appointmentDay.day) {
			this.http.put(
				`${environment.serverUrl}/panel/appointmentDay/max`,
				appointmentDay
			).subscribe();
		} else {
			appointmentDay.day = day;
			this.http.post(
				`${environment.serverUrl}/panel/appointmentDay`,
				[appointmentDay]
			).subscribe();
		}
	}

	findMechanicAppointmentByMechanic(
		dayMechanics: Mechanic[],
		mechanicId: number,
		appointmentIndex: number
	): any[] {
		const mechanic = dayMechanics.find(mechanic => mechanic.id == mechanicId);
		return [mechanic, mechanic.appointments[appointmentIndex]];
	}

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
				this.http.put(
					`${environment.serverUrl}/panel/appointment/type`,
					appointment
				).subscribe();
			}
		} else {
			this.http.delete(
				`${environment.serverUrl}/panel/appointment/type`,
				{params: {id: `${appointment.id}`, mechanicId: `${mechanic.id}`, index: `${appointment.index}`}}
			).subscribe();
			appointment.reset();
		}
		mechanic.appointments = mechanic.appointments.slice();
		NotificationService.notifyMechanicLine(mechanic.day, mechanic.code);
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
				`${environment.serverUrl}/panel/appointment/schedule`,
				appointment,
				{params: {mechanicId: `${mechanic.id}`}}
			).subscribe((createdAppointment: AppointmentSchedule) => {
				appointment.id = createdAppointment.id;
			});
		} else {
			this.http.put(
				`${environment.serverUrl}/panel/appointment/schedule`,
				appointment
			).subscribe()
		}
		NotificationService.notifyMechanicLine(mechanic.day, mechanic.code);
	}

}
