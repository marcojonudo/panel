import {Injectable} from '@angular/core';
import {AppointmentSchedule} from "../objects/appointment-schedule";
import {CommonService} from "./common.service";
import {AppointmentTypeScheduleDragInfo} from "../objects/appointment-type-schedule-drag-info";
import {Schedule} from "../objects/schedule";
import {Constants} from "../objects/constants";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Mechanic} from "../objects/mechanic";

@Injectable({
	providedIn: 'root'
})
export class AppointmentsService {

	constructor(
		private commonService: CommonService,
		private http: HttpClient
	) {
	}

	updateAppointmentType(
		mechanic: Mechanic,
		appointmentsSchedules: AppointmentSchedule[],
		index: number,
		appointmentTypeCode: string
	): void {
		const appointmentSchedule = appointmentsSchedules[index];
		const morning = appointmentSchedule.schedule.type == Constants.SCHEDULE_TYPE.MORNING;
		console.log(appointmentSchedule, index, morning);

		if (appointmentTypeCode) {
			const appointmentType = this.commonService.findAppointmentType(appointmentTypeCode);

			if (appointmentsSchedules[index]) {
				appointmentsSchedules[index].appointmentType = appointmentType;

				/* Si se cambia el tipo de cita cuando ya se tiene un horario, hay que actualizarlo en base de datos. En caso
				*  contrario, se actualiza en BD una vez se define el horario */
				this.http.put(
					`${environment.serverUrl}/panel/mechanic/appointments`,
					[mechanic],
					{params: {morning: `${morning}`}}
				).subscribe();
			} else {
				this.addAppointmentSchedule(
					appointmentsSchedules,
					new AppointmentSchedule(mechanic, {appointmentType: appointmentType}),
					index
				);
			}
		} else {
			appointmentsSchedules[index].reset();
			this.http.put(
				`${environment.serverUrl}/panel/mechanic/appointments`,
				[mechanic],
				{params: {morning: `${morning}`}}
			).subscribe();
			appointmentsSchedules[index] = undefined;
		}
	}

	updateAppointmentSchedule(
		mechanic: Mechanic,
		appointmentsSchedules: AppointmentSchedule[],
		index: number,
		type: string,
		dragSchedule: AppointmentTypeScheduleDragInfo[]
	): void {
		const start = `${dragSchedule[0].hour}:${dragSchedule[0].quarter}:00`;
		const end = `${dragSchedule[dragSchedule.length - 1].hour}:${dragSchedule[dragSchedule.length - 1].quarter + Constants.QUARTERS.STEP_15}:00`;

		const insertNewAppointment = appointmentsSchedules[index].schedule == undefined;
		const morning = type == Constants.SCHEDULE_TYPE.MORNING;

		appointmentsSchedules[index].schedule = morning
			? new Schedule(start, end, undefined, undefined)
			: new Schedule(undefined, undefined, start, end);

		if (insertNewAppointment) {
			this.http.post(
				`${environment.serverUrl}/panel/mechanic/appointments`,
				[mechanic],
				{params: {morning: `${morning}`}}
			).subscribe((appointment: AppointmentSchedule) => {
				appointmentsSchedules[index].id = appointment.id
			})
		} else {
			this.http.put(
				`${environment.serverUrl}/panel/mechanic/appointments`,
				[mechanic],
				{params: {morning: `${morning}`}}
			).subscribe()
		}
	}

	private addAppointmentSchedule(
		appointmentsSchedules: AppointmentSchedule[],
		appointmentSchedule: AppointmentSchedule,
		i: number
	): void {
		if (i == 0) {
			if (appointmentsSchedules.length == 2) {
				appointmentsSchedules[0] = appointmentSchedule;
			} else {
				appointmentsSchedules.unshift(appointmentSchedule);
			}
		} else {
			/* Si se añade un horario de tarde (index 1), pero no hay horario de mañana (index 0), es necesario añadir
			*  también un elemento nulo para que el de tarde quede en el index correcto */
			const pushElem = appointmentsSchedules[0] ? [appointmentSchedule] : [undefined, appointmentSchedule];
			appointmentsSchedules.push(...pushElem);
		}
	}

}
