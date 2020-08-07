import {Injectable} from '@angular/core';
import {DaysMechanics} from "../objects/days-mechanics";
import {Mechanic} from "../objects/mechanic";
import {UtilsService} from "./utils.service";
import {Skill} from "../objects/skill";
import {NotificationService} from "./notification.service";
import {HttpClient} from "@angular/common/http";
import {Url} from "../objects/url";
import {Constants} from "../objects/constants";
import * as dayjs from "dayjs";
import {Dayjs} from "dayjs";
import {DropzoneUpdate} from "../objects/trigger-cd/update-objects/mechanic-line/dropzone-update";

@Injectable({
	providedIn: 'root'
})
export class MechanicsService {

	private static _days: Dayjs[];
	private static _daysMechanics: DaysMechanics;
	private static _todaySchedules: boolean;
	private static _futureSchedules: boolean;
	private static _onlyAppointmentsMode: boolean;
	private static _showAppointmentsName: boolean = true;

	constructor(private http: HttpClient) {}

	// region Getters / setters

	static get days(): Dayjs[] {
		return this._days;
	}

	static set days(value: Dayjs[]) {
		this._days = value;
	}

	static get daysMechanics(): DaysMechanics {
		return this._daysMechanics;
	}

	static set daysMechanics(value: DaysMechanics) {
		this._daysMechanics = value;
	}

	static get onlyAppointmentsMode(): boolean {
		return this._onlyAppointmentsMode;
	}

	static set onlyAppointmentsMode(value: boolean) {
		this._onlyAppointmentsMode = value;
	}

	static get showAppointmentsName(): boolean {
		return this._showAppointmentsName;
	}

	static set showAppointmentsName(value: boolean) {
		this._showAppointmentsName = value;
	}

	static get futureSchedules(): boolean {
		return this._futureSchedules;
	}

	static set futureSchedules(value: boolean) {
		this._futureSchedules = value;
	}

	static get todaySchedules(): boolean {
		return this._todaySchedules;
	}

	static set todaySchedules(value: boolean) {
		this._todaySchedules = value;
	}

	// endregion

	// region Finders

	public static findDayMechanics(day: Dayjs, fixed: boolean = undefined): Mechanic[] {
		const dayMechanics = this.daysMechanics[day.valueOf()];
		if (dayMechanics) {
			if (fixed) {
				return dayMechanics.filter((mechanic: Mechanic) => mechanic.fixed);
			} else if (fixed == false) {
				return dayMechanics.filter((mechanic: Mechanic) => !mechanic.fixed);
			}
		}
		return dayMechanics;
	}

	public static findMechanic(day: Dayjs, code: string): Mechanic {
		return this.findDayMechanics(day).find((mechanic: Mechanic) => mechanic.code == code);
	}

	public static findMechanicByPosition(day: Dayjs, position: string): Mechanic {
		return this.findDayMechanics(day).find((mechanic: Mechanic) => mechanic.panelPosition == position);
	}

	// endregion

	// region Init

	static init(daysMechanics: { [key: string]: any[] }, skills: any[], highlightedSkills: Skill[]) {
		if (daysMechanics) {
			this.days = this.initDays(daysMechanics);
			this.daysMechanics = this.initDaysMechanics(daysMechanics, skills, highlightedSkills);

			const today = dayjs().startOf(Constants.DAY_JS.d);
			this.todaySchedules = Object.entries(this.daysMechanics).find(([day, mechanics]) => {
				return +day == today.valueOf() && mechanics.length > 0
			}) != undefined;
			this.futureSchedules = this.todaySchedules ? this.todaySchedules : Object.keys(this.daysMechanics).length > 0;
		} else {
			this.days = [];
			this.daysMechanics = {};
			this.todaySchedules = false;
			this.futureSchedules = false;
		}

		console.log('Days', this.days);
		console.log('Days mechanics', this.daysMechanics);
	}

	static initDays(daysMechanics: { [key: string]: any[] }): Dayjs[] {
		return UtilsService.sort(
			Object.keys(daysMechanics).map(day => dayjs(day)),
			(elem: Dayjs) => elem.valueOf()
		);
	}

	static initDaysMechanics(
		daysMechanics: { [key: string]: any[] },
		skills: any[],
		highlightedSkills: Skill[]
	): DaysMechanics {
		const parsedDaysMechanics = {};
		for (const [dayString, mechanics] of Object.entries(daysMechanics)) {
			const day = dayjs(dayString);
			const parsedMechanics = mechanics.map(mechanic => new Mechanic(mechanic, skills, highlightedSkills));
			parsedDaysMechanics[day.valueOf()] =
				UtilsService.sort(parsedMechanics, (m) => m.panelPosition);
		}
		/* Si no hay hay mecánicos para el día actual, se añade una lista vacía. Así se facilitan operaciones
		*  relacionadas con arrays, evitando tener que comprobar si la entrada del objeto es undefined */
		const today = dayjs().startOf(Constants.DAY_JS.d);
		if (!parsedDaysMechanics[today.valueOf()]) {
			parsedDaysMechanics[today.valueOf()] = [];
		}
		return parsedDaysMechanics;
	}

	// endregion

	static updateMechanicLines(mechanic: Mechanic, newLines: number): void {
		mechanic.setLines(newLines);
		NotificationService.notifyMechanicLine(
			mechanic.day,
			mechanic.code,
			true
		);
	}

	updateDbMechanicLines(mechanic: Mechanic): void {
		this.http.put(Url.mechanicLines(), [mechanic]).subscribe();
	}

	removeMechanic(
		day: Dayjs,
		mechanic: Mechanic,
		updateDb: boolean = true,
		mechanics: Mechanic[] = MechanicsService.findDayMechanics(day)
	) {
		mechanic.showInPanel = false;

		const index = mechanics.indexOf(mechanic);
		MechanicsService.rearrangeMechanics(mechanics, index);

		NotificationService.notifyMechanicLine(undefined, undefined, true, new DropzoneUpdate());

		if (updateDb) {
			this.http.put(Url.mechanicsPosition(), mechanics.concat(mechanic)).subscribe();
		}
	}

	private static rearrangeMechanics(mechanics: Mechanic[], removedMechanicIndex: number): void {
		let prevPosition = mechanics[removedMechanicIndex].panelPosition;
		mechanics.splice(removedMechanicIndex, 1);

		const lastMechanicIndex = mechanics[mechanics.length - 1].fixed ? mechanics.length - 2 : mechanics.length;
		for (let i = removedMechanicIndex; i < lastMechanicIndex; i++) {
			const newPosition = mechanics[i].panelPosition;
			mechanics[i].panelPosition = prevPosition;
			prevPosition = newPosition;
		}
	}

	static toggleOnlyAppointmentsMode(): void {
		MechanicsService.onlyAppointmentsMode = !MechanicsService.onlyAppointmentsMode;
		NotificationService.notifyTriggerCd();
	}

	static toggleShowAppointmentsName(): void {
		MechanicsService.showAppointmentsName = !MechanicsService.showAppointmentsName;
		/* Se notifica el Observer de onlyAppointmentsMode ya que una vez actualizada la variable (en este caso,
		*  showAppointmentsMode), sólo interesa lanzar el CD */
		NotificationService.notifyTriggerCd();
	}

	static checkExistentDaysMechanics(daysMechanics: DaysMechanics = this.daysMechanics): boolean {
		return Object.keys(daysMechanics).length > 0;
	}

}
