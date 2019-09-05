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

	private dayModeSubject: BehaviorSubject<boolean>;
	private _oneDayMode$: Observable<boolean>;

	private lineHeightSubject: BehaviorSubject<number>;
	private _lineHeight$: Observable<number>;

	private daysMechanicsSubjects: any;
	private _daysMechanics$: any;

	constructor() {
		// this.days = [
		// 	UtilsService.parseDateFromString('2019-06-25'),
		// 	UtilsService.parseDateFromString('2019-06-26'),
		// 	UtilsService.parseDateFromString('2019-06-27'),
		// 	UtilsService.parseDateFromString('2019-06-28')
		// ];

		this.oneDayMode = true;
		this._lineHeight = Constants.VALUE.LINE_HEIGHT_DEFAULT;

		this.dayModeSubject = new BehaviorSubject<boolean>(this.oneDayMode);
		this.oneDayMode$ = this.dayModeSubject.asObservable();

		this.lineHeightSubject = new BehaviorSubject<number>(this._lineHeight);
		this.lineHeight$ = this.lineHeightSubject.asObservable();

		// this.mechanics = [
		// 	new Mechanic('2019-06-25', 'A', 2),
		// 	new Mechanic('2019-06-25', 'B', 2),
		// 	new Mechanic('2019-06-25', 'C', 2),
		// 	new Mechanic('2019-06-25', 'D', 2),
		// 	new Mechanic('2019-06-26', 'A', 2),
		// 	new Mechanic('2019-06-26', 'B', 2),
		// 	new Mechanic('2019-06-26', 'C', 2),
		// 	new Mechanic('2019-06-27', 'A', 2),
		// 	new Mechanic('2019-06-27', 'B', 2),
		// 	new Mechanic('2019-06-27', 'C', 2),
		// 	new Mechanic('2019-06-27', 'D', 2),
		// 	new Mechanic('2019-06-27', 'E', 2)
		// ];
		// this.daysMechanics = this.initDaysMechanics(this.mechanics);

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
		this._lineHeight = this.oneDayMode ? Constants.VALUE.LINE_HEIGHT_DEFAULT : Constants.VALUE.LINE_HEIGHT_NARROW;
		this.dayModeSubject.next(this.oneDayMode);
		this.lineHeightSubject.next(this._lineHeight);
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
