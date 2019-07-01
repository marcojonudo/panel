import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  public static parseTime(time: string): Date {
    const info = time.split(":");
    let date = new Date();
    date.setHours(parseInt(info[0]));
    date.setMinutes(parseInt(info[1]));
    date.setSeconds(parseInt(info[2]));

    return date;
  }

  public static getTotalMinutes(time: Date): number {
    return time.getHours()*60 + time.getMinutes();
  }

}
