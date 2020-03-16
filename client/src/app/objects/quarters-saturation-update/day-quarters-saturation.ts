import {QuartersSaturation} from "../quarters-saturation";
import {Dayjs} from "dayjs";

export class DayQuartersSaturation {

	day: Dayjs;
	quartersSaturation: QuartersSaturation;

	constructor(day: Dayjs, quartersSaturation: QuartersSaturation) {
		this.day = day;
		this.quartersSaturation = quartersSaturation;
	}

}
