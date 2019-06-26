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
    this.oneDayMode = !this.oneDayMode;
    this.dayModeSubject.next(this.oneDayMode);
  }

  get days() {
    return ['2019-06-25', '2019-06-26', '2019-06-27', '2019-06-15'];
    // return [{id: 1}, {id: 2}, {id: 3}];
  }


}
