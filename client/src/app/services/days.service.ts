import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {Observable} from "rxjs/internal/Observable";
import {MechanicLineContainerComponent} from "../components/mechanic-line-container/mechanic-line-container.component";
import {Mechanic} from "../objects/mechanic";

@Injectable({
  providedIn: 'root'
})
export class DaysService {

  private oneDayMode: boolean;
  private sliceDays: number;

  private _days: string[];
  private _mechanics: Mechanic[];

  private daysMechanics: any;

  private dayModeSubject;
  oneDayMode$: Observable<boolean>;

  private daysMechanicsSubjects: any;
  private _daysMechanics$: any;

  constructor() {
    this.days = ['2019-06-25', '2019-06-26', '2019-06-27', '2019-06-15'];

    this.oneDayMode = true;
    this.sliceDays = this.days.length - 1;
    this.dayModeSubject = new BehaviorSubject<boolean>(this.oneDayMode);
    this.oneDayMode$ = this.dayModeSubject.asObservable();

    this.mechanics = [new Mechanic('2019-06-25', 'A'), new Mechanic('2019-06-25', 'B'), new Mechanic('2019-06-25', 'C'), new Mechanic('2019-06-25', 'D'), new Mechanic('2019-06-26', 'A'), new Mechanic('2019-06-26', 'B'), new Mechanic('2019-06-26', 'C'), new Mechanic('2019-06-27', 'A'), new Mechanic('2019-06-27', 'B'), new Mechanic('2019-06-27', 'C'), new Mechanic('2019-06-27', 'D'), new Mechanic('2019-06-27', 'E')];
    this.daysMechanics = this.initDaysMechanics(this.mechanics);
    console.log('daysMechanics', this.daysMechanics);

    this.initObservables(this.daysMechanics);
    console.log('daysMechanicsSubejcts', this.daysMechanicsSubjects);
    console.log('daysMechanicsObs', this.daysMechanics$);
  }

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
    this.dayModeSubject.next(this.oneDayMode);
  }

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

}
