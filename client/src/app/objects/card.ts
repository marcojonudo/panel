export class Card {

	id: number;
	day: string;
	mechanicCode: string;

	start: string;
	private _duration: number;
	end: string;
	topLine: boolean;

	left: number;
	private _width: number;

	constructor(id: number, day: string, mechanicCode: string, start: string, duration: number, end: string, topLine: boolean) {
		this.id = id;
		this.day = day;
		this.mechanicCode = mechanicCode;
		this.start = start;
		this._duration = duration;
		this.end = end;
		this.topLine = topLine;
	}

	// region Getters / setters

	get duration(): number {
		return this._duration;
	}

	set duration(value: number) {
		this._duration = value;
	}

	get width(): number {
		return this._width;
	}

	set width(value: number) {
		this._width = value;
	}

	// endregion

}
