import {MechanicUpdate} from "./mechanic-update";

export class MechanicInfoUpdate implements MechanicUpdate {

	type: string;
	day: Date;
	mechanicCode: string;

	constructor(day: Date, mechanicCode: string) {
		this.day = day;
		this.mechanicCode = mechanicCode;
	}

}
