import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DaysPanelsService {

  private oneDayMode: boolean;

  constructor() {
    this.oneDayMode = true;
  }

  toggleDayMode() {
    this.oneDayMode = !this.oneDayMode;
  }

  getOneDayMode() {
    return this.oneDayMode;
  }

  getDaysPanels() {
    return [1, 2, 3];
  }

}
