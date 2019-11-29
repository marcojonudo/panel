import {Injectable} from '@angular/core';
import {AppointmentSchedule} from "../objects/appointment-schedule";
import {CommonService} from "./common.service";
import {DragScheduleInfo} from "../objects/drag-schedule-info";
import {Schedule} from "../objects/schedule";
import {Constants} from "../objects/constants";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Mechanic} from "../objects/mechanic";
import {DaysService} from "./days.service";
import {MechanicUpdateTrigger} from "../objects/mechanic-update/mechanic-update-trigger";
import {AppointmentsCounterUpdate} from "../objects/update-appointments-counter/appointments-counter-update";
import {Subject} from "rxjs/internal/Subject";
import {Observable} from "rxjs/internal/Observable";
import {CardsGroup} from "../objects/cards-group";
import {AppointmentType} from "../objects/appointment-type";
import {Card} from "../objects/card";
import {TimeService} from "./time.service";
import {AppointmentDay} from "../objects/appointment-day";
import {AppointmentsCounterUpdateAdd} from "../objects/update-appointments-counter/appointments-counter-update-add";
import {AppointmentsCounterUpdateSubtract} from "../objects/update-appointments-counter/appointments-counter-update-subtract";

@Injectable({
	providedIn: 'root'
})
export class AppointmentsService {

	private readonly TOTAL: string = 'TOTAL';
	private readonly MAX: string = 'MAX';

	private appointmentTypes: AppointmentType[];
	private appointmentDays: AppointmentDay[];

	private appointmentsCounterSubject: Subject<AppointmentsCounterUpdate>;
	private _appointmentsCounter$: Observable<AppointmentsCounterUpdate>;
	private _daysAppointmentsCounter: any;

	constructor(
		private timeService: TimeService,
		private daysService: DaysService,
		private commonService: CommonService,
		private http: HttpClient
	) {
		this.appointmentsCounterSubject = new Subject<AppointmentsCounterUpdate>();
		this.appointmentsCounter$ = this.appointmentsCounterSubject.asObservable();
		this.daysAppointmentsCounter = {}
	}

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

	// region Getters / setters

	get appointmentsCounter$(): Observable<AppointmentsCounterUpdate> {
		return this._appointmentsCounter$;
	}

	set appointmentsCounter$(value: Observable<AppointmentsCounterUpdate>) {
		this._appointmentsCounter$ = value;
	}

	get daysAppointmentsCounter(): any {
		return this._daysAppointmentsCounter;
	}

	set daysAppointmentsCounter(value: any) {
		this._daysAppointmentsCounter = value;
	}

	// endregion

	updateAppointmentsCounter(cards: Card[]): void {
		this.notifyAppointment(new AppointmentsCounterUpdateSubtract(cards[0].lastDay, cards));
		this.notifyAppointment(new AppointmentsCounterUpdateAdd(cards[0].day, cards));

		const daysAppointmentsDayCreate = [];
		const daysAppointmentsDayUpdate = [];
		cards.forEach((card: Card) => {
			const appointmentTypeCode = card.group.appointmentType.code;
			/* Si tiene lastDay, ya había sido asignada con anterioridad (no sale de la cinta) */
			if (cards[0].lastDay) {
				this.updateAppointmentDayUpdateList(
					card.lastDay,
					appointmentTypeCode,
					daysAppointmentsDayCreate,
					daysAppointmentsDayUpdate
				)
			}
			/* Si tiene día, no está siendo bajada a la cinta */
			if (cards[0].day) {
				this.updateAppointmentDayUpdateList(
					card.day,
					appointmentTypeCode,
					daysAppointmentsDayCreate,
					daysAppointmentsDayUpdate
				)
			}
		});

		if (daysAppointmentsDayCreate.length) {
			this.http.post(
				`${environment.serverUrl}/panel/appointmentDay`,
				daysAppointmentsDayCreate
			).subscribe();
		}
		if (daysAppointmentsDayUpdate.length) {
			this.http.put(
				`${environment.serverUrl}/panel/appointmentDay/counters`,
				daysAppointmentsDayUpdate
			).subscribe();
		}
	}

	private updateAppointmentDayUpdateList(
		day: Date,
		appointmentTypeCode: string,
		createList: AppointmentDay[],
		updateList: AppointmentDay[]
	): void {
		const appointmentDay = this.daysAppointmentsCounter[day.getTime()][appointmentTypeCode];
		if (this.checkCreateAppointmentDay(appointmentDay)) {
			appointmentDay.day = day;
			createList.push(appointmentDay);
		} else {
			updateList.push(appointmentDay);
		}
	}

	private checkCreateAppointmentDay(appointmentDay: AppointmentDay): boolean {
		/* Si el AppointmentDay no tiene día, significa que no hay ningún registro en DB y es necesario crearlo,
		*  no actualizarlo */
		return appointmentDay.day == undefined;
	}

	notifyAppointment(counterUpdate: AppointmentsCounterUpdate): void {
		this.appointmentsCounterSubject.next(counterUpdate);
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
			appointment.appointmentType = this.commonService.findAppointmentType(newAppointmentTypeCode);

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
		this.notifyMechanic(mechanic);
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
		this.notifyMechanic(mechanic);
	}

	updateAppointments(mechanic: Mechanic): void {
		this.notifyMechanic(mechanic);
	}

	private notifyMechanic(mechanic: Mechanic): void {
		/* Se usa el slice para crear un array con nueva referencia, y que así se lance el CD en mechanic-line.component */
		mechanic.appointments = mechanic.appointments.slice();
		this.daysService.notifyDay(mechanic.day, new MechanicUpdateTrigger());
	}

}
