export class DragScheduleInfo {

	hour: number;
	quarter: number;
	type: string;

	constructor(hour: number, quarter: number, type: string) {
		this.hour = hour;
		this.quarter = quarter;
		this.type = type;
	}

}
