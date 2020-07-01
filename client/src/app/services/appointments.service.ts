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
import {ScheduleInterval} from "../objects/schedule-interval";
import {Dayjs} from "dayjs";
import {AppointmentsCounter} from "../objects/appointments-counter";
import * as dayjs from "dayjs";
import {CardsService} from "./cards.service";
import {CardsGroup} from "../objects/cards-group";

@Injectable({
	providedIn: 'root'
})
export class AppointmentsService {

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

	findDayAppointmentsCounter(
		day: Dayjs,
		daysAppointmentsCounter: DaysAppointmentsCounter = this.daysAppointmentsCounter
	): AppointmentsCounter {
		return daysAppointmentsCounter[day.valueOf()];
	}

	// endregion

	// region Init

	initAppointmentTypes(appointmentTypes: AppointmentType[]): void {
		AppointmentsService.appointmentTypes = appointmentTypes;
		console.log('Appointment types', AppointmentsService.appointmentTypes);
	}

	init(appointmentDays: any[]): void {
		this.appointmentDays = this.initAppointmentDays(appointmentDays);
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

	private initAppointmentDays(appointmentDays: any[]): AppointmentDay[] {
		return appointmentDays.map(appointmentDay => {
			const day = dayjs(appointmentDay.day);
			const appDay = new AppointmentDay(day, appointmentDay);
			if (appointmentDay.morning || appointmentDay.afternoon) {
				CardsService.findDayGroups(day).forEach((group: CardsGroup) => {
					if (group.cards[0].type == Constants.CARD_TYPE.APPOINTMENT) {
						group.cards.forEach((card: Card) => {
							appDay.addAppointmentCard(card.panelId, UtilsService.findScheduleType(group.start, card.end));
						});
					}
				});
			}
			if (appointmentDay.total) {
				CardsService.unassignedGroups.forEach((group: CardsGroup) => {
					if (group.cards[0].type == Constants.CARD_TYPE.APPOINTMENT && group.cards[0].order.day.isSame(day)) {
						appDay.total.push(...group.cards.map((c: Card) => c.panelId));
					}
				});
			}
			return appDay;
		});
	}

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

	// region Update appointment day

	updateAppointment(
		day: Dayjs,
		cards: Card[],
		add: boolean,
		updateAll: boolean,
		updateDb: boolean = false,
		daysAppointmentsCounter: DaysAppointmentsCounter = this.daysAppointmentsCounter
	): void {
		if (cards[0].type == Constants.CARD_TYPE.APPOINTMENT) {
			const appointmentDayCounters = daysAppointmentsCounter[day.valueOf()];
			const appointmentDaysToUpdate = [];
			for (const [typeCode, appointmentDay] of Object.entries(appointmentDayCounters)) {
				const typeCards = cards.filter((card: Card) => card.group.appointmentType.code == typeCode);
				typeCards.forEach(card => {
					if (updateAll) {
						this.updateAppointmentDay(appointmentDay, card, add, updateAll);
					} else {
						this.updateAppointmentDayTotal(appointmentDay, card.panelId, add);
					}
					if (appointmentDaysToUpdate.indexOf(appointmentDay) == -1) {
						appointmentDaysToUpdate.push(appointmentDay);
					}
				});
			}
			NotificationService.notifyAppointmentsCounter(day, appointmentDayCounters);

			if (updateDb) {
				console.log('put', appointmentDaysToUpdate);
				this.http.put(Url.appointmentsDaysCounters(), appointmentDaysToUpdate).subscribe();
			}
		}
	}

	private updateAppointmentDay(appointmentDay: AppointmentDay, card: Card, add: boolean, updateTotal: boolean): void {
		const scheduleType = UtilsService.findScheduleType(card.start, card.end);
		this.handleUpdateAppointmentsCounter(appointmentDay[scheduleType], card.panelId, add);
		if (updateTotal) {
			this.updateAppointmentDayTotal(appointmentDay, card.panelId, add);
		}
	}

	private updateAppointmentDayTotal(appointmentDay: AppointmentDay, cardId: string, add: boolean = true): void {
		this.handleUpdateAppointmentsCounter(appointmentDay[Constants.APPOINTMENT_COUNTER_TOTAL], cardId, add);
	}

	private handleUpdateAppointmentsCounter(cards: string[], cardId: string, add: boolean): void {
		const index = cards.findIndex((cardId: string) => cardId == cardId);
		if (add) {
			this.addAppointmentsCounter(cards, index, cardId);
		} else {
			this.removeAppointmentsCounter(cards, index);
		}
	}

	private addAppointmentsCounter(cards: string[], index: number, cardId: string): void {
		/* Si el grupo ya está añadido al contador de citas (por ejemplo, cuando se asigna un grupo, sus fichas ya
		*  figuran en el día de la orden), no se suma */
		if (index == -1) {
			cards.push(cardId);
		}
	}

	private removeAppointmentsCounter(cards: string[], index: number): void {
		cards.splice(index, 1);
	}

	// private updateAppointmentDayTotal2(
	// 	day: Dayjs,
	// 	cards: Card[],
	// 	add: boolean,
	// 	updateDb: boolean = false,
	// 	daysAppointmentsCounter: DaysAppointmentsCounter = this.daysAppointmentsCounter
	// ): void {
	// 	const appointmentDayCounters = daysAppointmentsCounter[day.valueOf()];
	//
	// 	appointmentDay[Constants.APPOINTMENT_COUNTER_TOTAL] += add ? 1 : -1;
	// }

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

		NotificationService.notifyMechanicLine(mechanic.day, mechanic.code);

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

		NotificationService.notifyMechanicLine(mechanic.day, mechanic.code);
	}

	static delete(
		mechanic: Mechanic,
		appointment: AppointmentSchedule
	): void {
		const appointmentIndex = mechanic.appointments.findIndex((appointmentSchedule: AppointmentSchedule) =>
			appointmentSchedule.equals(appointment)
		);
		mechanic.appointments.splice(appointmentIndex, 1);

		NotificationService.notifyMechanicLine(mechanic.day, mechanic.code);
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
