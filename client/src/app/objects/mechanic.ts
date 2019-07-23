import {UtilsService} from "../services/utils.service";

export class Mechanic {

	day: Date;
	position: string;

	constructor(day: string, position: string) {
		this.day = UtilsService.parseDateFromString(day);
		this.position = position;
	}

}
