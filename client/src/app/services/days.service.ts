import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {Observable} from "rxjs/internal/Observable";
import {MechanicLineContainerComponent} from "../components/mechanic-line-container/mechanic-line-container.component";
import {Mechanic} from "../objects/mechanic";
import {Constants} from "../objects/constants";
import {Coordinates} from "../objects/coordinates";

@Injectable({
  providedIn: 'root'
})
export class DaysService {

  private oneDayMode: boolean;
  private lineHeight: number;
  private sliceDays: number;

  private _days: string[];
  private _mechanics: Mechanic[];

  private _daysMechanics: any;

  private dayModeSubject: BehaviorSubject<boolean>;
  private _oneDayMode$: Observable<boolean>;

  private lineHeightSubject: BehaviorSubject<number>;
  private _lineHeight$: Observable<number>;

  private daysMechanicsSubjects: any;
  private _daysMechanics$: any;

  constructor() {
    this.days = ['2019-06-25', '2019-06-26', '2019-06-27', '2019-06-28'];

    this.oneDayMode = true;
    this.lineHeight = Constants.VALUE.LINE_HEIGHT_DEFAULT;
    this.sliceDays = this.days.length - 1;

    this.dayModeSubject = new BehaviorSubject<boolean>(this.oneDayMode);
    this.oneDayMode$ = this.dayModeSubject.asObservable();

    this.lineHeightSubject = new BehaviorSubject<number>(this.lineHeight);
    this.lineHeight$ = this.lineHeightSubject.asObservable();

    this.mechanics = [new Mechanic('2019-06-25', 'A'), new Mechanic('2019-06-25', 'B'), new Mechanic('2019-06-25', 'C'), new Mechanic('2019-06-25', 'D'), new Mechanic('2019-06-26', 'A'), new Mechanic('2019-06-26', 'B'), new Mechanic('2019-06-26', 'C'), new Mechanic('2019-06-27', 'A'), new Mechanic('2019-06-27', 'B'), new Mechanic('2019-06-27', 'C'), new Mechanic('2019-06-27', 'D'), new Mechanic('2019-06-27', 'E')];
    this.daysMechanics = this.initDaysMechanics(this.mechanics);

    this.initObservables(this.daysMechanics);
    console.log(this.daysMechanics);
  }

  // region Getters / setters

  get daysMechanics$(): any {
    return this._daysMechanics$;
  }
  set daysMechanics$(value: any) {
    this._daysMechanics$ = value;
  }

  get days() {
    return this._days;
  }
  set days(value: string[]) {
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

  // endregion

  initDaysMechanics(mechanics: Mechanic[]): any {
    let daysMechanics = {};

    for (let mechanic of mechanics) {
      if (!daysMechanics[mechanic.day]) {
        daysMechanics[mechanic.day] = [];
      }

      daysMechanics[mechanic.day].push(mechanic);
    }

    return daysMechanics;
  }

  initObservables(daysMechanics: any): void {
    this.daysMechanicsSubjects = {};
    this.daysMechanics$ = {};

    for (let day in daysMechanics) {
      const subject = new BehaviorSubject<Mechanic[]>(daysMechanics[day]);
      const observable = subject.asObservable();

      this.daysMechanicsSubjects[day] = subject;
      this.daysMechanics$[day] = observable;
    }
  }

  toggleDayMode() {
    this.oneDayMode = !this.oneDayMode;
    this.lineHeight = this.oneDayMode ? Constants.VALUE.LINE_HEIGHT_DEFAULT : Constants.VALUE.LINE_HEIGHT_NARROW;
    this.dayModeSubject.next(this.oneDayMode);
    this.lineHeightSubject.next(this.lineHeight);
  }

  get lineHeightDefault() {
    return Constants.VALUE.LINE_HEIGHT_DEFAULT;
  }

  get lineHeightNarrow() {
    return Constants.VALUE.LINE_HEIGHT_NARROW;
  }
}
