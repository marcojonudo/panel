import {Dayjs} from "dayjs";

export class ValidateCoordinatesInfo {

	line: number;
	newStart: Dayjs;
	newEnd: Dayjs;

	constructor(line: number, newStart: Dayjs, newEnd: Dayjs) {
		this.line = line;
		this.newStart = newStart;
		this.newEnd = newEnd;
	}

}
