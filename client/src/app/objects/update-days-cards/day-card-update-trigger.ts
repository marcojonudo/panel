import {DayCardUpdate} from "./day-card-update";

export class DayCardUpdateTrigger implements DayCardUpdate {

	day: Date;
	mechanicCode: string;

	constructor(day: Date, mechanicCode: string) {
		this.day = day;
		this.mechanicCode = mechanicCode;
	}

}
