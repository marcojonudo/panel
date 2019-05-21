import { Injectable } from '@angular/core';
import {Subject} from "rxjs/internal/Subject";
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {Observable} from "rxjs/internal/Observable";

@Injectable({
  providedIn: 'root'
})
export class TimeService {

  private readonly LEFT_SECTION_WIDTH: number = 180;

  private readonly MINUTE_WIDTH_DEFAULT: number = 6;
  private readonly SCROLLABLE_CONTAINER_WIDTH_MAX: number = 350; // (%)
  private readonly SCROLLABLE_CONTAINER_WIDTH_MIN: number = 100; // (%)

  private readonly START_HOUR: number = 8;
  private readonly HOURS_NUMBER: number = 16;
  private readonly MINUTES_PER_HOUR: number = 60;

  private minuteWidth: number;
  private widthValue: number;

  private hours: number[];
  private quarters: string[];

  private subject = new BehaviorSubject<number>(this.SCROLLABLE_CONTAINER_WIDTH_MAX);
  width$: Observable<number>;

  // widthValueChange: Subject<number> = new Subject<number>();

  constructor() {
    this.minuteWidth = this.MINUTE_WIDTH_DEFAULT;
    this.widthValue = this.SCROLLABLE_CONTAINER_WIDTH_MAX;
    this.hours = Array(this.HOURS_NUMBER).fill(0).map((x, i) => this.START_HOUR + i);
    this.quarters = ['00', '15', '30', '45'];
    this.width$ = this.subject.asObservable()
  }

  getHours() {
    return this.hours;
  }

  getQuarters() {
    return this.quarters;
  }

  getTotalTimeWidth() {
    return this.widthValue;
  }

  getMaxWidthValue() {
    return this.SCROLLABLE_CONTAINER_WIDTH_MAX;
  }

  getMinWidthValue() {
    return this.SCROLLABLE_CONTAINER_WIDTH_MIN;
  }

  setWidthValue(value: number) {
    // this.widthValue = value;
    // this.widthValueChange.next(value);
    // console.log('set width value');
    this.subject.next(value);
  }

  get minWidth() {
    return this.SCROLLABLE_CONTAINER_WIDTH_MIN;
  }

  toggleFitWidth() {
    this.widthValue = this.widthValue == this.SCROLLABLE_CONTAINER_WIDTH_MIN ?
      this.SCROLLABLE_CONTAINER_WIDTH_MAX : this.SCROLLABLE_CONTAINER_WIDTH_MIN;
    this.subject.next(this.widthValue);
  }

}
