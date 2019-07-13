import {Order} from "./order";

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

	private _order: Order;

	constructor(
		id: number,
		day: string,
		mechanicCode: string,
		start: string,
		duration: number,
		end: string,
		topLine: boolean,
		order: Order
	) {
		this.id = id;
		this.day = day;
		this.mechanicCode = mechanicCode;
		this.start = start;
		this.duration = duration;
		this.end = end;
		this.topLine = topLine;
		this.order = order;
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

	get order(): Order {
		return this._order;
	}

	set order(value: Order) {
		this._order = value;
	}

	// endregion

}
