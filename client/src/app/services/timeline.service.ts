import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimelineService {

  private readonly START_HOUR = 8;
  private readonly HOURS_NUMBER = 16;
  private hours: number[];
  private quarters: string[];

  constructor() {
    this.hours = Array(this.HOURS_NUMBER).fill(0).map((x, i) => this.START_HOUR + i);
    this.quarters = ['00', '15', '30', '45'];
  }

  getHours() {
    return this.hours;
  }

  getQuarters() {
    return this.quarters;
  }

}
