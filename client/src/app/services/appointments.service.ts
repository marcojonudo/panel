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
import {ScheduleInterval} from "../objects/schedule-interval";
import {AppointmentsCounterUpdate} from "../objects/update-appointments-counter/appointments-counter-update";
import {Subject} from "rxjs/internal/Subject";
import {Observable} from "rxjs/internal/Observable";
import {CardsGroup} from "../objects/cards-group";
import {AppointmentType} from "../objects/appointment-type";
import {Card} from "../objects/card";
import {TimeService} from "./time.service";
import {AppointmentsCounterUpdateAdd} from "../objects/update-appointments-counter/appointments-counter-update-add";
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {AppointmentsCounterUpdateInit} from "../objects/update-appointments-counter/appointments-counter-update-init";

@Injectable({
	providedIn: 'root'
})
export class AppointmentsService {

	private readonly TOTAL: string = 'TOTAL';

	private appointmentTypes: AppointmentType[];

	private appointmentsCounterSubject: BehaviorSubject<AppointmentsCounterUpdate>;
	private _appointmentsCounter$: Observable<AppointmentsCounterUpdate>;
	private appointmentsCounter: any;

	constructor(
		private timeService: TimeService,
		private daysService: DaysService,
		private commonService: CommonService,
		private http: HttpClient
	) {
		this.appointmentsCounterSubject = new BehaviorSubject<AppointmentsCounterUpdate>(this.appointmentsCounter);
		this.appointmentsCounter$ = this.appointmentsCounterSubject.asObservable();
		this.appointmentsCounter = {}
	}

	// region Init

	init(
		appointmentTypes: AppointmentType[],
		assignedGroups: CardsGroup[],
		unassignedGroups: CardsGroup[]
	): void {
		this.appointmentTypes = appointmentTypes;
		this.appointmentsCounter = this.initAppointmentsCounter();

		assignedGroups.filter((group: CardsGroup) => {
			return group.cards[0].order.code[0] == "C"
		}).forEach((group: CardsGroup) => {
			group.cards.forEach((card: Card) => {
				if (this.appointmentsCounter[card.group.appointmentType.code] != undefined) {
					const scheduleType = this.timeService.findTimeScheduleType(card.start);
					this.appointmentsCounter[card.group.appointmentType.code][scheduleType] =
						this.appointmentsCounter[card.group.appointmentType.code][scheduleType] + 1;
					this.appointmentsCounter[card.group.appointmentType.code][this.TOTAL] =
						this.appointmentsCounter[card.group.appointmentType.code][this.TOTAL] + 1;
				}
			})
		});
		console.log(this.appointmentsCounter);
		this.appointmentsCounterSubject.next(new AppointmentsCounterUpdateInit(this.appointmentsCounter));
	}

	initAppointmentsCounter(appointmentTypes: AppointmentType[] = this.appointmentTypes): any {
		const appointmentsCounter = {};
		appointmentTypes.filter(appointmentType => appointmentType.counter)
			.forEach((appointmentType: AppointmentType) => {
				appointmentsCounter[appointmentType.code] = {
					'MORNING': 0, 'AFTERNOON': 0, 'TOTAL': 0
				};
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

	// endregion

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
		this.notify(mechanic);
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
		this.notify(mechanic);
	}

	updateAppointments(mechanic: Mechanic): void {
		this.notify(mechanic);
	}

	private notify(mechanic: Mechanic): void {
		/* Se usa el slice para crear un array con nueva referencia, y que así se lance el CD en mechanic-line.component */
		mechanic.appointments = mechanic.appointments.slice();
		this.daysService.notifyDay(mechanic.day, new MechanicUpdateTrigger());
	}

}
