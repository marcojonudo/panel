import {Injectable} from '@angular/core';
import {Mechanic} from "../objects/mechanic";
import {NotificationService} from "./notification.service";
import {HttpClient} from "@angular/common/http";
import {Url} from "../objects/url";
import {Constants} from "../objects/constants";
import * as dayjs from "dayjs";
import {Dayjs} from "dayjs";
import {DropzoneUpdate} from "../objects/trigger-cd/update-objects/mechanic-line/dropzone-update";
import {LocalStorageService} from "./local-storage.service";
import {Employee} from "../objects/employee";
import {SkillsService} from "./skills.service";
import {ScheduleInterval} from "../objects/schedule-interval";

@Injectable({
	providedIn: 'root'
})
export class MechanicsService {

	private static readonly FIXED_MECHANICS: Mechanic[] = [
		new Mechanic({
			employeeData: {code: "9999995", name: "TALLER"},
			mechanicPanelInfo: {position: "Y", lines: 2},
			intervals: [],
			appointments: []
		}),
		new Mechanic({
			employeeData: {code: "9999996", name: "TIENDA"},
			mechanicPanelInfo: {position: "Z", lines: 2},
			intervals: [],
			appointments: []
		})
	]

	static days: Dayjs[];
	static mechanics: Mechanic[];
	static fixedMechanics: Mechanic[];
	static employees: Employee[];
	static firstScheduleDay: Dayjs;
	static lastScheduleDay: Dayjs;
	static todaySchedules: boolean;
	static futureSchedules: boolean;
	static onlyAppointmentsMode: boolean;
	static showAppointmentsName: boolean = true;

	constructor(private http: HttpClient) {}

	// region Finders

	public static findDayMechanics(day: Dayjs, mechanics: Mechanic[] = this.mechanics): Mechanic[] {
		return mechanics.filter(mechanic => mechanic.day.isSame(day));
	}

	public static findMechanic(day: Dayjs, code: string): Mechanic {
		return this.findDayMechanics(day).find((mechanic: Mechanic) => mechanic.code == code);
	}

	public static findMechanicByPosition(day: Dayjs, position: string): Mechanic {
		return this.findDayMechanics(day).find((mechanic: Mechanic) => mechanic.mechanicPanelInfo.position == position);
	}

	// endregion

	// region Init

	static init(mechanics: any[], employees: any[], firstScheduleDay: string, lastScheduleDay: string) {
		const today = dayjs().startOf(Constants.DAY_JS.d);

		this.employees = employees.map((employee: any) => new Employee(employee));
		console.log('Employees', this.employees);

		this.mechanics = mechanics.map(mechanic =>
			new Mechanic(mechanic, SkillsService.highlightedSkills, SkillsService.findAllSkillEmployees(mechanic.code))
		);
		console.log('Mechanics', this.mechanics);

		const todayMechanics = this.mechanics.filter(mechanic => mechanic.day.isSame(today));
		this.fixedMechanics = this.findFixedMechanics(todayMechanics, today);
		console.log('Fixed mechanics', this.fixedMechanics);
		this.mechanics = this.mechanics.concat(this.fixedMechanics);

		this.days = this.initDays(this.mechanics);
		console.log('Days', this.days);

		this.todaySchedules = todayMechanics.length > 0;
		//TODO
		this.futureSchedules = this.mechanics.length > 0;


		this.firstScheduleDay = this.mechanics[0].day.clone();
		this.lastScheduleDay = this.mechanics[this.mechanics.length - 1].day.clone();

		// this.loadFixedMechanics(daysMechanics, today)
		// if (daysMechanics) {
			// this.daysMechanics = this.initDaysMechanics(daysMechanics);

			// this.todaySchedules = this.days.find((day: Dayjs) => day.isSame(today)) != undefined;
			// if (this.todaySchedules) {
			// 	this.futureSchedules = this.todaySchedules;
			// 	this.storeFixedMechanics(daysMechanics, today);
			// } else {
			// 	this.futureSchedules = Object.keys(this.daysMechanics).length > 0;
			// }
		// 	this.firstScheduleDay = dayjs(firstScheduleDay)
		// 	this.lastScheduleDay = dayjs(lastScheduleDay);
		// } else {
		// 	this.days = [];
		// 	this.daysMechanics = {};
		// 	this.todaySchedules = false;
		// 	this.futureSchedules = false;
		// }

	}

	static findFixedMechanics(todayMechanics: Mechanic[], today: Dayjs): Mechanic[] {
		/* Si hay mecánicos para el día de hoy, se generan las líneas de taller y tienda a partir de los horarios
		 * existentes */
		if (todayMechanics.length) {
			return this.buildFixedMechanics(todayMechanics);
		} else {
			/* Si no, se obtienen del localstorage */
			const storedFixedMechanics = LocalStorageService.getItem(Constants.FIXED_SCHEDULES).map(m => new Mechanic(m));
			/* Si los horarios fijos almacenados son anteriores a hoy, no se cargan */
			return storedFixedMechanics[0].day.isBefore(today) ? [] : storedFixedMechanics;
		}
	}

	static buildFixedMechanics(mechanics: Mechanic[], fixedMechanics: Mechanic[] = this.FIXED_MECHANICS): Mechanic[] {
		const thresholdInterval = this.findThresholdInterval(mechanics);
		fixedMechanics.forEach(mechanic => {
			mechanic.day = mechanics[0].day;
			mechanic.intervals = [thresholdInterval];
		})
		LocalStorageService.setItem(Constants.FIXED_SCHEDULES, fixedMechanics);
		return fixedMechanics;
	}

	static findThresholdInterval(mechanics: Mechanic[]): ScheduleInterval {
		let minStart = undefined;
		let maxEnd = undefined;
		mechanics.forEach(mechanic => {
			mechanic.intervals.forEach(interval => {
				if (!minStart || interval.start.isBefore(minStart)) {
					minStart = interval.start.clone();
				}
				if (!maxEnd || interval.end.isAfter(maxEnd)) {
					maxEnd = interval.end.clone();
				}
			})
		})
		return new ScheduleInterval(minStart, maxEnd);
	}

	// static loadFixedMechanics(daysMechanics: { [key: string]: any[] }, today: Dayjs) {
	// 	const fixedMechanics = LocalStorageService.getItem(Constants.FIXED_SCHEDULES);
	// 	const formattedToday = today.format(Constants.DATE_FORMAT.yyyy_MM_dd);
	// 	if (!daysMechanics[formattedToday] && fixedMechanics) {
	// 		daysMechanics[formattedToday] = fixedMechanics;
	// 	}
	// }

	// static storeFixedMechanics(daysMechanics: { [key: string]: any[] }, today: Dayjs): void {
	// 	LocalStorageService.setItem(
	// 		Constants.FIXED_SCHEDULES,
	// 		daysMechanics[today.format(Constants.DATE_FORMAT.yyyy_MM_dd)].filter(mechanic => mechanic.mechanicPanelInfo.position >= "Y")
	// 	);
	// }

	static initDays(mechanics: Mechanic[]): Dayjs[] {
		const days = [];
		mechanics.forEach(mechanic => {
			const existentDay = days.find(day => day.isSame(mechanic.day));
			if (!existentDay) {
				days.push(mechanic.day);
			}
		})
		return days;
	}

	// static initDaysMechanics(daysMechanics: { [key: string]: any[] }): DaysMechanics {
	// 	const parsedDaysMechanics = {};
	// 	for (const [dayString, mechanics] of Object.entries(daysMechanics)) {
	// 		const day = dayjs(dayString);
	// 		console.log('mechanic', mechanics);
	// 		const parsedMechanics = mechanics.map(mechanic => new Mechanic(mechanic, SkillsService.highlightedSkills));
	// 		parsedDaysMechanics[day.valueOf()] =
	// 			UtilsService.sort(parsedMechanics, (m) => m.mechanicPanelInfo.position);
	// 	}
	// 	/* Si no hay hay mecánicos para el día actual, se añade una lista vacía. Así se facilitan operaciones
	// 	*  relacionadas con arrays, evitando tener que comprobar si la entrada del objeto es undefined */
	// 	const today = dayjs().startOf(Constants.DAY_JS.d);
	// 	if (!parsedDaysMechanics[today.valueOf()]) {
	// 		parsedDaysMechanics[today.valueOf()] = [];
	// 	}
	// 	return parsedDaysMechanics;
	// }

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
		let prevPosition = mechanics[removedMechanicIndex].mechanicPanelInfo.position;
		mechanics.splice(removedMechanicIndex, 1);

		const lastMechanicIndex = mechanics[mechanics.length - 1].fixed ? mechanics.length - 2 : mechanics.length;
		for (let i = removedMechanicIndex; i < lastMechanicIndex; i++) {
			const newPosition = mechanics[i].mechanicPanelInfo.position;
			mechanics[i].mechanicPanelInfo.position = prevPosition;
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

	static findEmployee(code: string): Employee {
		return this.employees.find((e: Employee) => e.code == code);
	}

}
