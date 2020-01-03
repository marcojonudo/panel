import {QuartersSaturation} from "../quarters-saturation";

export class DayQuartersSaturation {

	day: Date;
	quartersSaturation: QuartersSaturation;

	constructor(day: Date = undefined, quartersSaturation: QuartersSaturation = undefined) {
		this.day = day;
		this.quartersSaturation = quartersSaturation;
	}

}
