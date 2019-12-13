import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {Observable} from "rxjs/internal/Observable";
import {Mechanic} from "../objects/mechanic";
import {Constants} from "../objects/constants";
import {UtilsService} from "./utils.service";
import {Subject} from "rxjs/internal/Subject";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {DayMechanics} from "../objects/day-mechanics";
import {NotificationService} from "./notification.service";

@Injectable({
	providedIn: 'root'
})
export class DaysService {

	private readonly MECHANIC_BOTTOM_MARGIN: number = 10;
	private readonly TIMELINE_HEIGHT: number = 30;

	private oneDayMode: boolean;
	private _lineHeight: number;
	private sliceDays: number;
	// private _displayScrollbar: boolean;

	private _days: Date[];

	private _daysMechanics: any;

	private oneDayModeSubject: Subject<boolean>;
	private _oneDayMode$: Observable<boolean>;

	private lineHeightSubject: BehaviorSubject<number>;
	private _lineHeight$: Observable<number>;

	constructor(
		private http: HttpClient
	) {
		this.oneDayMode = true;
		this.lineHeight = Constants.VALUE.LINE_HEIGHT_DEFAULT;

		this.oneDayModeSubject = new Subject<boolean>();
		this.oneDayMode$ = this.oneDayModeSubject.asObservable();

		this.lineHeightSubject = new BehaviorSubject<number>(this.lineHeight);
		this.lineHeight$ = this.lineHeightSubject.asObservable();
	}

	// region Getters / setters

	get days(): Date[] {
		return this._days;
	}

	set days(value: Date[]) {
		this._days = value;
	}

	get lineHeight$(): Observable<number> {
		return this._lineHeight$;
	}

	set lineHeight$(value: Observable<number>) {
		this._lineHeight$ = value;
	}

	get oneDayMode$(): Observable<boolean> {
		return this._oneDayMode$;
	}

	set oneDayMode$(value: Observable<boolean>) {
		this._oneDayMode$ = value;
	}

	get daysMechanics(): DayMechanics {
		return this._daysMechanics;
	}

	set daysMechanics(value: DayMechanics) {
		this._daysMechanics = value;
	}

	get lineHeight(): number {
		return this._lineHeight;
	}

	set lineHeight(value: number) {
		this._lineHeight = value;
	}

	// endregion

	// region Init

	init(daysMechanicsList: any) {
		daysMechanicsList.sort((a, b) => a.day - b.day);
		this.initDays(daysMechanicsList);
		this.initDaysMechanics(daysMechanicsList);

		console.log('Days', this.days);
		console.log('Days mechanics', this.daysMechanics);
	}

	initDays(daysMechanicsList: any) {
		this.days = daysMechanicsList.map(entry => entry.day);
		this.sliceDays = this.days.length - 1;
	}

	initDaysMechanics(daysMechanicsList: any) {
		this.daysMechanics = {};
		for (let dayMechanics of daysMechanicsList) {
			this.daysMechanics[dayMechanics.day.getTime()] =
				UtilsService.sort(dayMechanics.mechanics, (m) => m.panelPosition);
		}
	}

	// endregion

	toggleDayMode() {
		this.oneDayMode = !this.oneDayMode;
		// this.lineHeight = this.oneDayMode ? Constants.VALUE.LINE_HEIGHT_DEFAULT : Constants.VALUE.LINE_HEIGHT_NARROW;
		this.oneDayModeSubject.next(this.oneDayMode);
		// this.lineHeightSubject.next(this.lineHeight);
	}

	checkDisplayScrollbar(
		gridHeight: number,
		today: Date,
		lineHeight: number = this.lineHeight,
		daysMechanics: DayMechanics = this.daysMechanics,
		oneDayMode: boolean = this.oneDayMode
	): boolean {
		if (!Object.keys(daysMechanics).length) {
			return false;
		}
		const mechanics = oneDayMode ? daysMechanics[today.getTime()] : [].concat(...Object.values(daysMechanics));
		if (mechanics.length) {
			const mechanicsHeight =
				UtilsService.sum(mechanics, 'lines') * lineHeight +
				mechanics.length * (this.MECHANIC_BOTTOM_MARGIN + 4) +
				this.TIMELINE_HEIGHT
			;
			return gridHeight < mechanicsHeight;
		}
		return false;
	}

	updateMechanicLines(mechanic: Mechanic, newLines: number): void {
		mechanic.lines = newLines;
		mechanic.height = this.lineHeight * mechanic.lines;
		NotificationService.notifyMechanicLine(mechanic.day, mechanic.code);
	}

	updateDbMechanicLines(mechanic: Mechanic): void {
		this.http.put(`${environment.serverUrl}/panel/mechanic/lines`, [mechanic]).subscribe();
	}

	removeMechanic(
		day: Date,
		mechanic: Mechanic,
		updateDb: boolean = true,
		mechanics: Mechanic[] = this.daysMechanics[day.getTime()]
	) {
		mechanic.showInPanel = false;

		const index = mechanics.indexOf(mechanic);
		this.rearrangeMechanics(mechanics, index);

		NotificationService.notifyMechanicLine(day, mechanic.code);

		if (updateDb) {
			this.http.put(
				`${environment.serverUrl}/panel/mechanic/position`,
				mechanics.concat(mechanic)
			).subscribe();
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

	findDayMechanics(day: Date): Mechanic[] {
		return this.daysMechanics[day.getTime()];
	}

	findMechanic(day: Date, code: string): Mechanic {
		return this.daysMechanics[day.getTime()].find(mechanic => mechanic.code == code);
	}

}
