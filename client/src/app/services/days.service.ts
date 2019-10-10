import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {Observable} from "rxjs/internal/Observable";
import {Mechanic} from "../objects/mechanic";
import {Constants} from "../objects/constants";
import {UtilsService} from "./utils.service";
import {Subject} from "rxjs/internal/Subject";
import {TimeService} from "./time.service";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";

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

	private daysMechanicsSubjects: any;
	private _daysMechanics$: any;

	constructor(private http: HttpClient) {
		this.oneDayMode = true;
		this.lineHeight = Constants.VALUE.LINE_HEIGHT_DEFAULT;

		this.oneDayModeSubject = new Subject<boolean>();
		this.oneDayMode$ = this.oneDayModeSubject.asObservable();

		this.lineHeightSubject = new BehaviorSubject<number>(this.lineHeight);
		this.lineHeight$ = this.lineHeightSubject.asObservable();
	}

	// region Getters / setters

	get daysMechanics$(): any {
		return this._daysMechanics$;
	}

	set daysMechanics$(value: any) {
		this._daysMechanics$ = value;
	}

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

	get daysMechanics(): any {
		return this._daysMechanics;
	}

	set daysMechanics(value: any) {
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

		this.initObservables(this.daysMechanics);
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

	initObservables(daysMechanics: any): void {
		this.daysMechanicsSubjects = {};
		this.daysMechanics$ = {};

		for (let dayTime in daysMechanics) {
			const subject = new Subject<Mechanic[]>();
			const observable = subject.asObservable();

			this.daysMechanicsSubjects[dayTime] = subject;
			this.daysMechanics$[dayTime] = observable;
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
		daysMechanics: any = this.daysMechanics,
		oneDayMode: boolean = this.oneDayMode
	): boolean {
		const mechanics = oneDayMode ? daysMechanics[today.getTime()] : [].concat(...Object.values(daysMechanics));
		const mechanicsHeight =
			UtilsService.sum(mechanics, 'lines') * lineHeight +
			mechanics.length * (this.MECHANIC_BOTTOM_MARGIN + 4) +
			this.TIMELINE_HEIGHT
		;
		return gridHeight < mechanicsHeight;
	}

	updateMechanicLines(mechanic: Mechanic): void {
		mechanic.lines = Math.round(mechanic.height / this.lineHeight);
		this.http.put(`${environment.serverUrl}/panel/mechanic/lines`, mechanic).subscribe();
	}

	removeMechanic(day: Date, position: string) {
		this.daysMechanics[day.getTime()] = this.daysMechanics[day.getTime()].filter(mechanic => {
			return mechanic.panelPosition != position;
		});
		this.daysMechanicsSubjects[day.getTime()].next(this.daysMechanics[day.getTime()]);
	}

}
