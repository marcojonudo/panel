import {MechanicUpdate} from "./mechanic-update";

export class MechanicLineUpdate implements MechanicUpdate {

	day: Date;
	mechanicCode: string;

	constructor(day: Date, mechanicCode: string) {
		this.day = day;
		this.mechanicCode = mechanicCode;
	}

}
