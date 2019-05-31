import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {Observable} from "rxjs/internal/Observable";

@Injectable({
  providedIn: 'root'
})
export class TimeService {


  private readonly MINUTE_WIDTH_DEFAULT: number = 6;
  private readonly SCROLLABLE_CONTAINER_WIDTH_MAX: number = 350; // (%)
  private readonly SCROLLABLE_CONTAINER_WIDTH_MIN: number = 100; // (%)

  private readonly START_HOUR: number = 8;
  private readonly HOURS_NUMBER: number = 16;
  private readonly INTERVALS_PER_QUARTER: number = 3;

  private minuteWidth: number;
  private widthValue: number;

  private hours: number[];
  private quarters: string[];

  private _intervalWidth: number;

  private subject = new BehaviorSubject<number>(this.SCROLLABLE_CONTAINER_WIDTH_MAX);
  width$: Observable<number>;

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

  get intervalsNumber() {
    return this.HOURS_NUMBER * this.quarters.length * this.INTERVALS_PER_QUARTER;
  }

  calculateIntervalWidth(dropzoneWidth: number) {
    this._intervalWidth = dropzoneWidth / this.intervalsNumber;
  }

  get intervalWidth(): number {
    return this._intervalWidth;
  }

}
