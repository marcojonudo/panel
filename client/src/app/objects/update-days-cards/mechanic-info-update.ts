import {MechanicUpdate} from "./mechanic-update";
import {Dayjs} from "dayjs";

export class MechanicInfoUpdate implements MechanicUpdate {

	type: string;
	day: Dayjs;
	mechanicCode: string;

	constructor(day: Dayjs, mechanicCode: string) {
		this.day = day;
		this.mechanicCode = mechanicCode;
	}

}
