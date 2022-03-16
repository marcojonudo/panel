import {Injectable} from '@angular/core';
import {Constants} from "../objects/constants";
import {HttpClient} from "@angular/common/http";
import {Mechanic} from "../objects/mechanic";
import {AppointmentType} from "../objects/appointments/appointment-type";
import {AppointmentDay} from "../objects/appointments/appointment-day";
import {NotificationService} from "./notification.service";
import {DaysAppointmentsCounter} from "../objects/days-appointments-counter";
import {Url} from "../objects/url";
import {Dayjs} from "dayjs";
import {AppointmentTypeValues} from "../objects/appointments/appointment-type-values";
import {ScheduleInterval} from "../objects/schedule-interval";
import {MechanicAppointment} from "../objects/mechanic-appointment";
import {Builder} from "../objects/builder";

@Injectable({
	providedIn: 'root'
})
export class AppointmentsService {

	private static _dragSchedulesMode: boolean = false;
	private static _dragSchedulesAppointmentType: AppointmentType;

	private static _appointmentTypes: AppointmentType[];
	private static appointmentDays: AppointmentDay[];

	private _daysAppointmentsCounter: DaysAppointmentsCounter;
	private _appointmentDaysToUpdate: AppointmentDay[];

	constructor(private http: HttpClient) {
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

	static findAppointmentTypes(counter: boolean): AppointmentType[] {
		return this.appointmentTypes.filter((appointmentType: AppointmentType) => appointmentType.counter == counter);
	}

	static findAppointmentDay(
		day: Dayjs,
		appointmentDays: AppointmentDay[] = this.appointmentDays
	): AppointmentDay {
		console.log('find appointment day', day, appointmentDays);
		return appointmentDays.find((appointmentDay: AppointmentDay) => appointmentDay.day.isSame(day));
	}

	static findMechanicAppointment(
		mechanic: Mechanic, appointmentTypeCode: string, start: Dayjs, end: Dayjs
	): MechanicAppointment {
		return mechanic.appointments.find(mechanicAppointment =>
			mechanicAppointment.appointmentTypeCode == appointmentTypeCode &&
			mechanicAppointment.interval.start.isSame(start) && mechanicAppointment.interval.end.isSame(end)
		)
	}

	// endregion

	// region Init

	static initAppointmentTypes(appointmentTypes: AppointmentType[]): void {
		AppointmentsService.appointmentTypes = appointmentTypes;
		console.log('Appointment types', AppointmentsService.appointmentTypes);
	}

	static init(appointmentDays: any[]): void {
		this.appointmentDays = appointmentDays.map(appointmentDay => new AppointmentDay(appointmentDay));
		console.log('Appointment types', AppointmentsService.appointmentTypes);
		console.log('Appointment days', this.appointmentDays);

		AppointmentsService.dragSchedulesAppointmentType = AppointmentsService.appointmentTypes
			.find((appointmentType: AppointmentType) =>
				appointmentType.code == Constants.APPOINTMENT_TYPE_CODE.RAP
			)
	}

	// endregion

	// region Saturation

	findMax(max: number, appointmentsSaturation): number {
		return Math.round(appointmentsSaturation * max)
	}

	checkSaturation(appointments: number, max: number, appointmentSaturation: number = 1): boolean {
		return appointments >= this.findMax(max, appointmentSaturation);
	}

	findSaturationPercentage(appointments: number, max: number, appointmentSaturation: number = 1): number {
		const maxAppointments = this.findMax(max, appointmentSaturation);
		if (!maxAppointments) {
			return 100;
		}
		const percentage = Math.round(appointments / maxAppointments * 100);
		return percentage > 100 ? 100 : percentage;
	}

	// endregion

	// region Update max

	addMax(appointmentDay: AppointmentDay, appointmentTypeCode: string): void {
		const values = appointmentDay.values.find((values: AppointmentTypeValues) =>
			values.appointmentType.code == appointmentTypeCode
		);
		values.max = values.max + 1;
		this.updateMaxDb(appointmentDay);
	}

	subtractMax(appointmentDay: AppointmentDay, appointmentTypeCode: string): void {
		const values = appointmentDay.values.find((values: AppointmentTypeValues) =>
			values.appointmentType.code == appointmentTypeCode
		);
		if (values.max - 1 >= 0) {
			values.max = values.max - 1 < 0 ? values.max : values.max - 1;
			this.updateMaxDb(appointmentDay);
		}
	}

	private updateMaxDb(appointmentDay: AppointmentDay): void {
		this.http.put(Url.appointmentDays(), [appointmentDay]).subscribe();
	}

	// endregion

	// region Mechanic appointment

	static addMechanicAppointment(mechanic: Mechanic, mechanicAppointment: MechanicAppointment): void {
		mechanic.appointments.push(mechanicAppointment);
		NotificationService.notifyMechanicLine(mechanic.day, mechanic.code);
	}

	static updateMechanicAppointment(
		mechanic: Mechanic, appointment: MechanicAppointment, start: Dayjs, end: Dayjs
	): void {
		appointment.interval = new ScheduleInterval(start, end);
		NotificationService.notifyMechanicLine(mechanic.day, mechanic.code);
	}

	static deleteMechanicAppointment(mechanic: Mechanic, appointment: MechanicAppointment): void {
		const appointmentIndex = mechanic.appointments.findIndex((mechanicAppointment: MechanicAppointment) =>
			mechanicAppointment.equals(appointment)
		);
		mechanic.appointments.splice(appointmentIndex, 1);

		NotificationService.notifyMechanicLine(mechanic.day, mechanic.code);
	}

	createDb(mechanic: Mechanic, appointment: MechanicAppointment): void {
		let url = `${Url.appointment()}?day=${mechanic.day.format(Constants.DATE_FORMAT.yyyy_MM_dd)}`
		url += `&mechanicCode=${mechanic.employeeData.code}`
		this.http.post(url, appointment).subscribe();
	}

	updateDb(mechanic: Mechanic, appointment: MechanicAppointment, initInterval: ScheduleInterval): void {
		const url = this.findUpdateUrl(mechanic, appointment, initInterval);
		this.http.patch(url, appointment).subscribe();
	}

	deleteDb(mechanic: Mechanic, appointment: MechanicAppointment, initInterval: ScheduleInterval): void {
		const url = this.findUpdateUrl(mechanic, appointment, initInterval);
		this.http.delete(url).subscribe();
	}

	findUpdateUrl(mechanic: Mechanic, appointment: MechanicAppointment, initInterval: ScheduleInterval): string {
		let url = `${Url.appointment()}?day=${mechanic.day.format(Constants.DATE_FORMAT.yyyy_MM_dd)}`;
		url += `&mechanicCode=${mechanic.employeeData.code}`
		url += `&appointmentTypeCode=${appointment.appointmentTypeCode}`
		url += `&lastStart=${initInterval.start.format(Constants.TIME_FORMAT.HH_mm)}`
		url += `&lastEnd=${initInterval.end.format(Constants.TIME_FORMAT.HH_mm)}`
		return url
	}

	// endregion

	static toggleDragSchedulesMode(): void {
		this.dragSchedulesMode = !this.dragSchedulesMode;
		NotificationService.notifyMainCursor(
			this.dragSchedulesMode ? Constants.MAIN_CURSOR.DRAGGING_SCHEDULES : Constants.MAIN_CURSOR.DEFAULT
		);
	}

	static updateAppointmentDays(appointmentDays: AppointmentDay[]): void {
		console.log('SETTING appointmn days', appointmentDays);
		this.appointmentDays = appointmentDays;
	}

}
