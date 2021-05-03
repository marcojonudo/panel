export class HourQuarters {

	hour: number;
	quarters: number[];
	type: string;

	constructor(hour: number, quarters: number[], type: string = undefined) {
		this.hour = hour;
		this.quarters = quarters;
		this.type = type;
	}

}
