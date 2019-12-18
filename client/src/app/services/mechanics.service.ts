import {Injectable} from '@angular/core';
import {DaysMechanics} from "../objects/days-mechanics";
import {Mechanic} from "../objects/mechanic";
import {UtilsService} from "./utils.service";
import {Skill} from "../objects/skill";
import {NotificationService} from "./notification.service";
import {HttpClient} from "@angular/common/http";
import {Url} from "../objects/url";
import {DimensionsService} from "./dimensions.service";

@Injectable({
	providedIn: 'root'
})
export class MechanicsService {

	private _days: Date[];
	private _daysMechanics: DaysMechanics;

	constructor(private http: HttpClient) {}

	// region Getters / setters

	get days(): Date[] {
		return this._days;
	}

	set days(value: Date[]) {
		this._days = value;
	}

	get daysMechanics(): DaysMechanics {
		return this._daysMechanics;
	}

	set daysMechanics(value: DaysMechanics) {
		this._daysMechanics = value;
	}

	// endregion

	// region Finders

	findDayMechanics(day: Date): Mechanic[] {
		return this.daysMechanics[day.getTime()];
	}

	findMechanic(day: Date, code: string): Mechanic {
		return this.findDayMechanics(day).find(mechanic => mechanic.code == code);
	}

	findMechanicByPosition(day: Date, position: string): Mechanic {
		return this.findDayMechanics(day).find(mechanic => mechanic.panelPosition == position);
	}

	// endregion

	// region Init

	init(daysMechanics: { [key: string]: any[] }, skills: any[], highlightedSkills: Skill[]) {
		this.days = this.initDays(daysMechanics);
		this.daysMechanics = this.initDaysMechanics(daysMechanics, skills, highlightedSkills);

		console.log('Days', this.days);
		console.log('Days mechanics', this.daysMechanics);
	}

	initDays(daysMechanics: { [key: string]: any[] }): Date[] {
		return Object.keys(daysMechanics).map(day => UtilsService.parseDateFromString(day));
	}

	initDaysMechanics(
		daysMechanics: { [key: string]: any[] },
		skills: any[],
		highlightedSkills: Skill[]
	): DaysMechanics {
		const parsedDaysMechanics = {};
		for (const [dayString, mechanics] of Object.entries(daysMechanics)) {
			const day = UtilsService.parseDateFromString(dayString);
			const parsedMechanics = mechanics.map(mechanic =>
				new Mechanic(day, mechanic, skills, highlightedSkills)
			);
			parsedDaysMechanics[day.getTime()] =
				UtilsService.sort(parsedMechanics, (m) => m.panelPosition);
		}
		return parsedDaysMechanics;
	}

	// endregion

	// toggleDayMode() {
	// 	this.oneDayMode = !this.oneDayMode;
	// 	// this.lineHeight = this.oneDayMode ? Constants.VALUE.LINE_HEIGHT_DEFAULT : Constants.VALUE.LINE_HEIGHT_NARROW;
	// 	this.oneDayModeSubject.next(this.oneDayMode);
	// 	// this.lineHeightSubject.next(this.lineHeight);
	// }
	//
	// checkDisplayScrollbar(
	// 	gridHeight: number,
	// 	today: Date,
	// 	lineHeight: number = this.lineHeight,
	// 	daysMechanics: DaysMechanics = this.daysMechanics,
	// 	oneDayMode: boolean = this.oneDayMode
	// ): boolean {
	// 	if (!Object.keys(daysMechanics).length) {
	// 		return false;
	// 	}
	// 	const mechanics = oneDayMode ? daysMechanics[today.getTime()] : [].concat(...Object.values(daysMechanics));
	// 	if (mechanics.length) {
	// 		const mechanicsHeight =
	// 			UtilsService.sum(mechanics, 'lines') * lineHeight +
	// 			mechanics.length * (this.MECHANIC_BOTTOM_MARGIN + 4) +
	// 			this.TIMELINE_HEIGHT
	// 		;
	// 		return gridHeight < mechanicsHeight;
	// 	}
	// 	return false;
	// }
	//
	updateMechanicLines(mechanic: Mechanic, newLines: number): void {
		mechanic.setLines(newLines);
		NotificationService.notifyMechanicLine(mechanic.day, mechanic.code);
	}

	updateDbMechanicLines(mechanic: Mechanic): void {
		this.http.put(Url.updateMechanicLines(), [mechanic]).subscribe();
	}

	removeMechanic(
		day: Date,
		mechanic: Mechanic,
		updateDb: boolean = true,
		mechanics: Mechanic[] = this.findDayMechanics(day)
	) {
		mechanic.showInPanel = false;

		const index = mechanics.indexOf(mechanic);
		this.rearrangeMechanics(mechanics, index);

		NotificationService.notifyMechanicLine(day, mechanic.code);

		if (updateDb) {
			this.http.put(Url.updateMechanicsPosition(), mechanics.concat(mechanic)).subscribe();
		}
	}

	private rearrangeMechanics(mechanics: Mechanic[], removedMechanicIndex: number): void {
		let prevPosition = mechanics[removedMechanicIndex].panelPosition;
		mechanics.splice(removedMechanicIndex, 1);

		for (let i = removedMechanicIndex; i < mechanics.length; i++) {
			const newPosition = mechanics[i].panelPosition;
			mechanics[i].panelPosition = prevPosition;
			prevPosition = newPosition;
		}
	}

}
