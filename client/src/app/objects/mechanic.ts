import {UtilsService} from "../services/utils.service";
import {Constants} from "./constants";

export class Mechanic {

	day: Date;
	position: string;
	lines: number;
	height: number;

	constructor(day: string, position: string, lines: number) {
		this.day = UtilsService.parseDateFromString(day);
		this.position = position;
		this.lines = lines;
		this.height = lines * Constants.VALUE.LINE_HEIGHT_DEFAULT;
	}

}
