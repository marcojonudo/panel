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

@Injectable({
	providedIn: 'root'
})
export class AppointmentsService {

	private readonly TOTAL: string = 'TOTAL';
	private readonly MAX: string = 'MAX';

	private _appointmentTypes: AppointmentType[];
	private appointmentDays: AppointmentDay[];

	private _daysAppointmentsCounter: DaysAppointmentsCounter;

	constructor(
		private http: HttpClient
	) {
		this.daysAppointmentsCounter = {}
	}

	// region Getters / setters

	get appointmentTypes(): AppointmentType[] {
		return this._appointmentTypes;
	}

	set appointmentTypes(value: AppointmentType[]) {
		this._appointmentTypes = value;
	}

	get daysAppointmentsCounter(): any {
		return this._daysAppointmentsCounter;
	}

	set daysAppointmentsCounter(value: any) {
		this._daysAppointmentsCounter = value;
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
		assignedDaysGroups: any,
		unassignedGroups: CardsGroup[]
	): void {
		this.appointmentTypes = appointmentTypes;
		this.appointmentDays = appointmentDays.map(appointmentDay => {
			return new AppointmentDay(appointmentDay.appointmentType, appointmentDay.day, appointmentDay)
		});

		console.log('Appointment types', this.appointmentTypes);
		console.log('Appointment days', this.appointmentDays);

		this.initDaysAppointmentsCounter(this.appointmentDays, assignedDaysGroups);

		console.log('Days appointments counter', this.daysAppointmentsCounter);
	}

	private initDaysAppointmentsCounter(
		appointmentDays: AppointmentDay[],
		assignedDaysGroups: any
	): void {
		appointmentDays.forEach((appointmentDay: AppointmentDay) => {
			const [time, code] = [appointmentDay.day.getTime(), appointmentDay.appointmentType.code];
			if (!this.daysAppointmentsCounter[time]) {
				this.daysAppointmentsCounter[time] = this.initAppointmentsCounter();
			}
			this.daysAppointmentsCounter[time][code] = appointmentDay;
		});
		/* Además de los appointmentDays, se recorre también los grupos asignados, ya que contienen como key todos los
		*  días posibles de horarios. De esta forma, si no hay información de citas para un día concreto, en este bucle
		*  se creará la información vacía corresponciente */
		for (const time of Object.keys(assignedDaysGroups)) {
			if (!this.daysAppointmentsCounter[time]) {
				this.daysAppointmentsCounter[time] = this.initAppointmentsCounter();
			}
		}
	}

	initAppointmentsCounter(
		appointmentTypes: AppointmentType[] = this.appointmentTypes
	): any {
		const appointmentsCounter = {};
		appointmentTypes.filter(appointmentType => appointmentType.counter)
			.forEach((appointmentType: AppointmentType) => {
				appointmentsCounter[appointmentType.code] = new AppointmentDay(appointmentType)
			});
		return appointmentsCounter;
	}

	// endregion

	updateAppointmentSubtract(
		cards: Card[],
		day: Date,
		daysAppointmentsCounter: DaysAppointmentsCounter = this.daysAppointmentsCounter
	): void {
		const appointmentDaysToUpdate = [];
		cards.forEach((card: Card) => {
			const appointmentDay = daysAppointmentsCounter[day.getTime()][card.group.appointmentType.code];
			this.updateAppointmentDay(appointmentDay, card, false);

			appointmentDaysToUpdate.push(appointmentDay);
		});
		NotificationService.notifyAppointmentsCounter(new AppointmentsCounterUpdateTrigger(day, cards));

		this.http.put(Url.updateAppointmentsDays(), appointmentDaysToUpdate).subscribe();
	}

	updateAppointmentAdd(
		cards: Card[],
		day: Date,
		daysAppointmentsCounter: DaysAppointmentsCounter = this.daysAppointmentsCounter
	): void {
		const [create, update] = [[], []];
		cards.forEach((card: Card) => {
			const appointmentDay = daysAppointmentsCounter[day.getTime()][card.group.appointmentType.code];
			this.updateAppointmentDay(appointmentDay, card);

			if (appointmentDay.day) {
				update.push(appointmentDay);
			} else {
				appointmentDay.day = card.day;
				create.push(appointmentDay);
			}
		});
		NotificationService.notifyAppointmentsCounter(new AppointmentsCounterUpdateTrigger(day, cards));

		if (create.length) {
			this.http.post(Url.createAppointmentDays(), create).subscribe();
		}
		if (update.length) {
			this.http.put(Url.updateAppointmentsDays(), update).subscribe();
		}
	}

	updateAppointmentDay(appointmentDay: AppointmentDay, card: Card, add: boolean = true): void {
		const scheduleType = UtilsService.findScheduleType(card.start, card.end);
		appointmentDay[`${scheduleType.toLowerCase()}`] += add ? 1 : -1;
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
