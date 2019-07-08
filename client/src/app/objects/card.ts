export class Card {

	id: number;
	day: string;
	mechanicCode: string;

	start: string;
	duration: number;
	end: string;
	topLine: boolean;

	left: number;
	width: number;

	constructor(id: number, day: string, mechanicCode: string, start: string, duration: number, end: string, topLine: boolean) {
		this.id = id;
		this.day = day;
		this.mechanicCode = mechanicCode;
		this.start = start;
		this.duration = duration;
		this.end = end;
		this.topLine = topLine;
	}

}
