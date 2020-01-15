import {QuartersSaturation} from "../quarters-saturation";

export class DayQuartersSaturation {

	day: Date;
	quartersSaturation: QuartersSaturation;

	constructor(day: Date, quartersSaturation: QuartersSaturation) {
		this.day = day;
		this.quartersSaturation = quartersSaturation;
	}

}
