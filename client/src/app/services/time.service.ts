import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {Observable} from "rxjs/internal/Observable";
import {CardsService} from "./cards.service";

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
  private readonly MINUTES_PER_INTERVAL: number = 5;
  private readonly LEFT_OFFSET: number = 180;
  private readonly MINUTES_8: number = 480;

  private widthValue: number;

  private hours: number[];
  private quarters: string[];

  private _percentageWidth: number;
  private _dropzoneWidth: number;
  private _intervalWidth: number;

  private _intervalsNumber: number;

  private percentageWidthSubject: BehaviorSubject<number>;
  private _percentageWidth$: Observable<number>;

  private intervalWidthSubject: BehaviorSubject<number>;
  private _intervalWidth$: Observable<number>;

  private widthSubscription: any;

  constructor() {
    // this.minuteWidth = this.MINUTE_WIDTH_DEFAULT;
    this.widthValue = this.SCROLLABLE_CONTAINER_WIDTH_MAX;
    this.hours = Array(this.HOURS_NUMBER).fill(0).map((x, i) => this.START_HOUR + i);
    this.quarters = ['00', '15', '30', '45'];
    this.intervalsNumber = this.HOURS_NUMBER * this.quarters.length * this.INTERVALS_PER_QUARTER;

    this.percentageWidth = this.SCROLLABLE_CONTAINER_WIDTH_MAX;
    this.percentageWidthSubject = new BehaviorSubject<number>(this.SCROLLABLE_CONTAINER_WIDTH_MAX);
    this.percentageWidth$ = this.percentageWidthSubject.asObservable();

    this.intervalWidthSubject = new BehaviorSubject<number>(0);
    this.intervalWidth$ = this.intervalWidthSubject.asObservable()
  }

  // region Getters / setters

  get percentageWidth$(): Observable<number> {
    return this._percentageWidth$;
  }

  set percentageWidth$(value: Observable<number>) {
    this._percentageWidth$ = value;
  }

  get percentageWidth(): number {
    return this._percentageWidth;
  }

  set percentageWidth(value: number) {
    this._percentageWidth = value;
  }

  get intervalWidth$(): Observable<number> {
    return this._intervalWidth$;
  }

  set intervalWidth$(value: Observable<number>) {
    this._intervalWidth$ = value;
  }

  get dropzoneWidth(): number {
    return this._dropzoneWidth;
  }

  set dropzoneWidth(value: number) {
    this._dropzoneWidth = value;
    this.resize()
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
    this.percentageWidthSubject.next(value);
  }

  get minWidth() {
    return this.SCROLLABLE_CONTAINER_WIDTH_MIN;
  }

  toggleFitWidth() {
    this.widthValue = this.widthValue == this.SCROLLABLE_CONTAINER_WIDTH_MIN ?
      this.SCROLLABLE_CONTAINER_WIDTH_MAX : this.SCROLLABLE_CONTAINER_WIDTH_MIN;
    this.percentageWidthSubject.next(this.widthValue);
  }

  resize() {
    // const width = (this.dropzoneWidth + 180) * (this.percentageWidth/100) - 180;
    this.intervalWidth = this.dropzoneWidth / this.intervalsNumber;
    this.intervalWidthSubject.next(this.intervalWidth);

    // this.cardsService.initDimensions()
    // console.log('calculate', dropzoneWidth, this.intervalsNumber);
    // this._intervalWidth = dropzoneWidth / this.intervalsNumber;
  }

  getRelativeMinutes(time: Date) {
    const minutes = time.getHours()*60 + time.getMinutes();
    return minutes - this.getStartScheduleMinutes();
  }

  private getStartScheduleMinutes() {
    return this.START_HOUR * this.MINUTES_PER_HOUR;
  }

  getIntervalsNumber(value: number) {
    return value / this.MINUTES_PER_INTERVAL;
  }

  getIntervalsNumberFromLeft(left: number) {
    return left / this.intervalWidth;
  }

  getRelativeMinutesFromIntervals(intervalsNumber: number): number {
    return this.MINUTES_8 + this.MINUTES_PER_INTERVAL * intervalsNumber;
  }

  getStart(minutes: number) {
    const hours = minutes / 60 < 10 ? `0${minutes/60}` : `${minutes/60}`;
    const m = minutes % 60 < 10 ? `0${minutes%60}` : `${minutes%60}`;
    return `${hours}:${m}:00`
  }

}
