import {Injectable} from '@angular/core';
import {Constants} from "../objects/constants";
import {Dayjs} from "dayjs";
import * as dayjs from "dayjs";
import {HourQuarters} from "../objects/hour-quarters";

@Injectable({
	providedIn: 'root'
})
export class UtilsService {

	// region Date

	public static parseTime(time: string, day: Dayjs = dayjs()): Dayjs {
		const info = time.split(":");
		return day.hour(+info[0]).minute(+info[1]);
	}

	public static isDate(date: Dayjs) {
		return date.hour() == 0 && date.minute() == 0 && date.second() == 0
	}

	public static calcMinutes(hour: number, minutes: number): number {
		return hour * Constants.HOUR_MINUTES + minutes;
	}

	public static calcMinutesFromDate(day: Dayjs): number {
		return day.hour() * Constants.HOUR_MINUTES + day.minute();
		// return day.diff(<Dayjs> day.startOf(Constants.DAY_JS.d), Constants.DAY_JS.m);
	}

	// endregion

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

	public static sumValues(array: any[]): number {
		return array.reduce((a, b) => a + b, 0);
	}

	public static filter(array: any[], property: any, value: any) {
		return array.filter(item => property(item) == value);
	}

	public static findScheduleType(start: Dayjs, end: Dayjs) {
		const threshold = UtilsService.parseTime(Constants.MORNING_AFTERNOON_THRESHOLD_TIME);

		const startDiff = threshold.diff(start, Constants.DAY_JS.m);
		const endDiff = end.diff(threshold, Constants.DAY_JS.m);

		return startDiff > endDiff ? Constants.SCHEDULE_TYPE.MORNING : Constants.SCHEDULE_TYPE.AFTERNOON;
	}

	public static roundToDecimal(n: number, decimal: number): number {
		return +n.toFixed(decimal);
	}

	public static roundCeil(n: number, roundTo: number): number {
		return Math.ceil(n/roundTo) * roundTo;
	}

	public static roundFloor(n: number, roundTo: number): number {
		return Math.floor(n/roundTo) * roundTo;
	}

	public static isImage(fileName: string): boolean {
		return fileName.indexOf('.png') > -1 || fileName.indexOf('.svg') > 1;
	}

	public static checkLeftClick(event: PointerEvent): boolean {
		return event.button == Constants.LEFT_CLICK_BUTTON_ID;
	}

}
