import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {Observable} from "rxjs/internal/Observable";
import {Mechanic} from "../objects/mechanic";
import {Constants} from "../objects/constants";
import {UtilsService} from "./utils.service";

@Injectable({
	providedIn: 'root'
})
export class DaysService {

	private oneDayMode: boolean;
	private _lineHeight: number;
	private sliceDays: number;

	private _days: Date[];
	private _mechanics: Mechanic[];

	private _daysMechanics: any;

	private oneDayModeSubject: BehaviorSubject<boolean>;
	private _oneDayMode$: Observable<boolean>;

	private lineHeightSubject: BehaviorSubject<number>;
	private _lineHeight$: Observable<number>;

	private daysMechanicsSubjects: any;
	private _daysMechanics$: any;

	constructor() {
		this.oneDayMode = true;
		this.lineHeight = Constants.VALUE.LINE_HEIGHT_DEFAULT;

		this.oneDayModeSubject = new BehaviorSubject<boolean>(this.oneDayMode);
		this.oneDayMode$ = this.oneDayModeSubject.asObservable();

		this.lineHeightSubject = new BehaviorSubject<number>(this._lineHeight);
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

	get mechanics() {
		return this._mechanics;
	}

	set mechanics(mechanics: Mechanic[]) {
		this._mechanics = mechanics
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
				UtilsService.sort(dayMechanics.mechanics, (m) => m.position);
		}
	}

	initObservables(daysMechanics: any): void {
		this.daysMechanicsSubjects = {};
		this.daysMechanics$ = {};

		for (let dayTime in daysMechanics) {
			const subject = new BehaviorSubject<Mechanic[]>(daysMechanics[dayTime]);
			const observable = subject.asObservable();

			this.daysMechanicsSubjects[dayTime] = subject;
			this.daysMechanics$[dayTime] = observable;
		}
	}

	// endregion

	toggleDayMode() {
		this.oneDayMode = !this.oneDayMode;
		this.lineHeight = this.oneDayMode ? Constants.VALUE.LINE_HEIGHT_DEFAULT : Constants.VALUE.LINE_HEIGHT_NARROW;
		this.oneDayModeSubject.next(this.oneDayMode);
		this.lineHeightSubject.next(this.lineHeight);
	}

	get lineHeightDefault() {
		return Constants.VALUE.LINE_HEIGHT_DEFAULT;
	}

	get lineHeightNarrow() {
		return Constants.VALUE.LINE_HEIGHT_NARROW;
	}

	updateMechanicLines(mechanic: Mechanic): void {
		mechanic.lines = Math.round(mechanic.height / this.lineHeight);
		console.log(mechanic);
	}

}
