import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DaysPanelsService {

  private oneDayMode: boolean;
  private sliceDaysNumber: number;

  constructor() {
    this.oneDayMode = true;
    this.sliceDaysNumber = this.days.length - 1;
  }

  toggleDayMode() {
    this.oneDayMode = !this.oneDayMode;
  }

  getOneDayMode() {
    return this.oneDayMode;
  }

  get days() {
    return [1, 2, 3];
  }

}
