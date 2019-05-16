import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimeService {

  private readonly LEFT_SECTION_WIDTH: number = 180;

  private readonly MINUTE_WIDTH_DEFAULT: number = 6;

  private readonly START_HOUR: number = 8;
  private readonly HOURS_NUMBER: number = 16;
  private readonly MINUTES_PER_HOUR: number = 60;

  private minuteWidth: number;

  private fitWidth: boolean;

  private hours: number[];
  private quarters: string[];

  constructor() {
    this.minuteWidth = this.MINUTE_WIDTH_DEFAULT;
    this.hours = Array(this.HOURS_NUMBER).fill(0).map((x, i) => this.START_HOUR + i);
    this.quarters = ['00', '15', '30', '45'];
  }

  getHours() {
    return this.hours;
  }

  getQuarters() {
    return this.quarters;
  }

  getTotalTimeWidth() {
    return this.LEFT_SECTION_WIDTH + this.HOURS_NUMBER * this.MINUTES_PER_HOUR * this.minuteWidth;
  }

  fitTimeToScreen() {
    this.fitWidth = !this.fitWidth;
  }

  getFitWidth() {
    return this.fitWidth;
  }

}
