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

@Injectable({
	providedIn: 'root'
})
export class AppointmentsService {

	constructor(
		private daysService: DaysService,
		private commonService: CommonService,
		private http: HttpClient
	) {
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
				console.log(appointment);
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
		console.log('***', mechanic.appointments);
		if (insertNewAppointment) {
			this.http.post(
				`${environment.serverUrl}/panel/appointment/schedule`,
				appointment,
				{params: {mechanicId: `${mechanic.id}`}}
			).subscribe((createdAppointment: AppointmentSchedule) => {
				appointment.id = createdAppointment.id;
				console.log(appointment);
				console.log(mechanic.appointments);

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
