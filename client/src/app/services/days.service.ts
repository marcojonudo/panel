import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {Observable} from "rxjs/internal/Observable";

@Injectable({
  providedIn: 'root'
})
export class DaysService {

  private oneDayMode: boolean;
  private sliceDays: number;

  private dayModeSubject;
  oneDayMode$: Observable<boolean>;

  constructor() {
    this.oneDayMode = true;
    this.sliceDays = this.days.length - 1;
    this.dayModeSubject = new BehaviorSubject<boolean>(this.oneDayMode);
    this.oneDayMode$ = this.dayModeSubject.asObservable();
  }

  toggleDayMode() {
    // this.sliceDays = this.sliceDays === 0 ? this.days.length - 1 : 0;
    // this.dayModeSubject.next(this.sliceDays)
    this.oneDayMode = !this.oneDayMode;
    this.dayModeSubject.next(this.oneDayMode);
  }

  // getOneDayMode() {
  //   return this.oneDayMode;
  // }

  // get oneDayMode() {
  //   return this.oneDayMode
  // }

  getSliceDaysNumber(): number {
    return this.sliceDays;
  }

  get days() {
    return [1, 2, 3, 4, 5, 6, 7, 8];
    // return [{id: 1}, {id: 2}, {id: 3}];
  }


}
