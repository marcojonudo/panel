import {MechanicUpdate} from "./mechanic-update";

export class MechanicLineUpdate implements MechanicUpdate {

	type: string;
	day: Date;
	mechanicCode: string;

	constructor(type: string, day: Date = undefined, mechanicCode: string = undefined) {
		this.type = type;
		this.day = day;
		this.mechanicCode = mechanicCode;
	}

}
