import {MechanicUpdate} from "./mechanic-update";
import {Dayjs} from "dayjs";

export class MechanicLineUpdate implements MechanicUpdate {

	type: string;
	day: Dayjs;
	mechanicCode: string;

	constructor(type: string, day: Dayjs = undefined, mechanicCode: string = undefined) {
		this.type = type;
		this.day = day;
		this.mechanicCode = mechanicCode;
	}

}
