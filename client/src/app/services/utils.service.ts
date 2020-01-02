import {Injectable} from '@angular/core';
import {Card} from "../objects/card";
import {Constants} from "../objects/constants";

@Injectable({
	providedIn: 'root'
})
export class UtilsService {

	// region Date

	public static parseTimeFromString(time: string): Date {
		const info = time.split(":");
		let date = new Date();
		date.setHours(parseInt(info[0]));
		date.setMinutes(parseInt(info[1]));
		date.setSeconds(parseInt(info[2]));
		date.setMilliseconds(0);

		return date;
	}

	public static parseTimeFromMinutes(minutes: number, day: Date = new Date()): Date {
		return new Date(day.getFullYear(), day.getMonth(), day.getDate(), minutes/60, minutes%60)
	}

	public static parseDateFromString(date: string): Date {
		const info = date.split('-');
		return new Date(+info[0], +info[1]-1, +info[2]);
	}

	public static parseDateFromLong(date: number): Date {
		return new Date(date);
	}

	public static parseCompleteDate(day: Date, start: string): Date {
		const timeInfo = start.split(':');
		return new Date(day.getFullYear(), day.getMonth(), day.getDate(), +timeInfo[0], +timeInfo[1], +timeInfo[2]);
	}

	public static getTotalMinutes(time: Date): number {
		return time.getHours() * 60 + time.getMinutes();
	}

	public static addMinutes(date: Date, minutes: number): Date {
		return new Date(date.getTime() + minutes*60000);
	}

	public static timeGreaterThan(time1: Date, time2: Date) {
		time1.setFullYear(time2.getFullYear());
		time1.setMonth(time2.getMonth());
		time1.setDate(time2.getDate());
		return time1 > time2;
	}

	public static clearTime(date: Date) {
		date.setHours(0, 0, 0, 0);
		return date;
	}

	public static isDate(date: Date) {
		return date.getHours() == 0 && date.getMinutes() == 0 && date.getSeconds() == 0
	}

	// endregion

	public static createMinutesArray(from: number, to: number): number[] {
		const length = (to - from) / 5;
		let array = [];
		for (let i = 0; i < length+1; i++) {
			array.push(from + i * 5);
		}
		return array;
	}

	public static sort(array: any[], property: any): any[] {
		return array.sort((a, b) => {
			if (property(a) < property(b)) {
				return -1;
			}
			if (property(b) < property(a)) {
				return 0;
			}
			return 0;
		});
	}

	public static sum(array: any[], property: string): number {
		return array.map(card => card[property]).reduce((a, b) => a + b, 0);
	}

	public static filter(array: any[], property: any, value: any) {
		return array.filter(item => property(item) == value);
	}

	public static getScheduleHours(start: Date, end: Date): number[] {
		const startHour = start.getHours();
		const endHour = end.getHours() + (Math.ceil(end.getMinutes()/60) > 0 ? 1 : 0);
		return Array(endHour - startHour).fill(0).map((x, i) => startHour + i);
	}

	public static getScheduleMinutes(start: Date, end: Date) {
		return Math.round((end.getTime() - start.getTime()) / 60000);
	}

	public static findScheduleType(start: Date, end: Date) {
		const startDiff = Math.abs(this.getTotalMinutes(start) - Constants.MORNING_AFTERNOON_THRESHOLD_MINUTES);
		const endDiff = Math.abs(this.getTotalMinutes(end) - Constants.MORNING_AFTERNOON_THRESHOLD_MINUTES);
		return startDiff > endDiff ? Constants.SCHEDULE_TYPE.MORNING : Constants.SCHEDULE_TYPE.AFTERNOON;
	}

	public static roundToDecimal(n: number, decimal: number): number {
		return +n.toFixed(decimal);
	}

}
