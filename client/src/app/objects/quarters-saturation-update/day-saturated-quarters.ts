import {Dayjs} from "dayjs";
import {HourQuarter} from "../hour-quarter";

export class DaySaturatedQuarters {

	day: Dayjs;
	saturatedQuarters: HourQuarter[];

	constructor(day: Dayjs, saturatedQuarters: HourQuarter[]) {
		this.day = day;
		this.saturatedQuarters = saturatedQuarters;
	}

}
