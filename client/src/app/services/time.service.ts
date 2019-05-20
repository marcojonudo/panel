import { Injectable } from '@angular/core';
import {Subject} from "rxjs/internal/Subject";

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

  private fitWidth: boolean;

  private hours: number[];
  private quarters: string[];

  widthValueChange: Subject<number> = new Subject<number>();

  constructor() {
    this.minuteWidth = this.MINUTE_WIDTH_DEFAULT;
    this.widthValue = this.SCROLLABLE_CONTAINER_WIDTH_MAX;
    this.hours = Array(this.HOURS_NUMBER).fill(0).map((x, i) => this.START_HOUR + i);
    this.quarters = ['00', '15', '30', '45'];
    this.widthValueChange.subscribe((value) => {
      console.log('widthValueChange in service');
      this.widthValue = value;
    })
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
    this.widthValueChange.next(value);
  }

  fitTimeToScreen() {
    this.fitWidth = !this.fitWidth;
  }

  getFitWidth() {
    return this.fitWidth;
  }

}
