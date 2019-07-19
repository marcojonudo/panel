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

	private _linkedNextId: number;
	private _linkedPrevId: number;

	constructor(
		id: number,
		day: string,
		mechanicCode: string,
		start: string,
		duration: number,
		end: string,
		topLine: boolean,
		order: Order,
		linkedPrevId: number,
		linkedNextId: number
	) {
		this.id = id;
		this.day = day;
		this.mechanicCode = mechanicCode;
		this.start = start;
		this.duration = duration;
		this.end = end;
		this.topLine = topLine;
		this.order = order;
		this.linkedPrevId = linkedPrevId;
		this.linkedNextId = linkedNextId;
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

	get linkedPrevId(): number {
		return this._linkedPrevId;
	}

	set linkedPrevId(value: number) {
		this._linkedPrevId = value;
	}
	get linkedNextId(): number {
		return this._linkedNextId;
	}

	set linkedNextId(value: number) {
		this._linkedNextId = value;
	}

	// endregion

	clone() {
		return new Card(this.id, this.day, this.mechanicCode, this.start, this.duration, this.end, this.topLine,
							this.order, this.linkedPrevId, this.linkedNextId);
	}

}
