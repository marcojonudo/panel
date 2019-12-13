import {MechanicLineUpdate} from "./mechanic-line-update";

export class MechanicLineUpdateTrigger implements MechanicLineUpdate {

	day: Date;
	mechanicCode: string;

	constructor(day: Date, mechanicCode: string) {
		this.day = day;
		this.mechanicCode = mechanicCode;
	}

}
