import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {Observable} from "rxjs/internal/Observable";

@Injectable({
  providedIn: 'root'
})
export class TimeService {

  private readonly SCROLLABLE_CONTAINER_WIDTH_MAX: number = 350; // (%)
  private readonly SCROLLABLE_CONTAINER_WIDTH_MIN: number = 100; // (%)

  private readonly START_HOUR: number = 8;
  private readonly HOURS_NUMBER: number = 16;
  private readonly MINUTES_PER_HOUR: number = 60;
  private readonly QUARTERS_PER_HOUR: number = 4;
  private readonly INTERVALS_PER_QUARTER: number = 3;

  private widthValue: number;

  private hours: number[];
  private quarters: string[];

  private _percentageWidth: number;
  private _dropzoneWidth: number;
  private _intervalWidth: number;

  private _intervalsNumber: number;

  private widthSubject: BehaviorSubject<number>;
  private _width$: Observable<number>;

  private widthSubscription: any;

  constructor() {
    // this.minuteWidth = this.MINUTE_WIDTH_DEFAULT;
    this.widthValue = this.SCROLLABLE_CONTAINER_WIDTH_MAX;
    this.hours = Array(this.HOURS_NUMBER).fill(0).map((x, i) => this.START_HOUR + i);
    this.quarters = ['00', '15', '30', '45'];
    this.intervalsNumber = this.HOURS_NUMBER * this.quarters.length * this.INTERVALS_PER_QUARTER;

    this.percentageWidth = this.SCROLLABLE_CONTAINER_WIDTH_MAX;
    this.widthSubject = new BehaviorSubject<number>(this.SCROLLABLE_CONTAINER_WIDTH_MAX);
    this.width$ = this.widthSubject.asObservable()
  }

  // region Getters / setters

  get width$(): Observable<number> {
    return this._width$;
  }

  set width$(value: Observable<number>) {
    this._width$ = value;
  }

  get percentageWidth(): number {
    return this._percentageWidth;
  }

  set percentageWidth(value: number) {
    this._percentageWidth = value;
  }

  get dropzoneWidth(): number {
    return this._dropzoneWidth;
  }

  set dropzoneWidth(value: number) {
    this._dropzoneWidth = value;
    this.calculateIntervalWidth()
  }

  get intervalWidth(): number {
    return this._intervalWidth;
  }

  set intervalWidth(value: number) {
    this._intervalWidth = value;
  }

  get intervalsNumber(): number {
    return this._intervalsNumber;
  }

  set intervalsNumber(value: number) {
    this._intervalsNumber = value;
  }

  // endregion

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
    this.widthSubject.next(value);
  }

  get minWidth() {
    return this.SCROLLABLE_CONTAINER_WIDTH_MIN;
  }

  toggleFitWidth() {
    this.widthValue = this.widthValue == this.SCROLLABLE_CONTAINER_WIDTH_MIN ?
      this.SCROLLABLE_CONTAINER_WIDTH_MAX : this.SCROLLABLE_CONTAINER_WIDTH_MIN;
    this.widthSubject.next(this.widthValue);
  }

  calculateIntervalWidth() {
    const width = (this.dropzoneWidth + 180) * (this.percentageWidth/100) - 180;
    this.intervalWidth = width / this.intervalsNumber;
    // console.log('calculate', dropzoneWidth, this.intervalsNumber);
    // this._intervalWidth = dropzoneWidth / this.intervalsNumber;
  }

  // parseTime(time: str/*ing) {
  //   const info = time.split(":");
  //   let date = new Date();
  //   date.setHours(parseInt(info[0]));
  //   date.setMinutes(parseInt(info[1]));
  //   date.setSeconds(parseInt(info[2]));
  //
  //   return date;
  // }*/

  getStartScheduleMinutes() {
    return this.START_HOUR * this.MINUTES_PER_HOUR;
  }

  getRelativeMinutes(time: string) {
    const info = time.split(":");
    const minutes = parseInt(info[0])*60 + parseInt(info[1]);
    return minutes - this.getStartScheduleMinutes();
  }

}
