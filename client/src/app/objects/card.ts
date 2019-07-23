import {Order} from "./order";
import {UtilsService} from "../services/utils.service";

export class Card {

	id: number;
	day: Date;
	mechanicCode: string;

	private _start: Date;
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
		this.day = day ? UtilsService.parseDateFromString(day) : undefined;
		this.mechanicCode = mechanicCode;
		this.start = start ? UtilsService.parseDateFromCompleteString(`${day} ${start}`) : undefined;
		this.duration = duration;
		this.end = end;
		this.topLine = topLine;
		this.order = order;
		this.linkedPrevId = linkedPrevId;
		this.linkedNextId = linkedNextId;
	}

	// region Getters / setters

	get start(): Date {
		return this._start;
	}

	set start(value: Date) {
		this._start = value;
	}

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
		let card = new Card(this.id, undefined, this.mechanicCode, undefined, this.duration, this.end,
							this.topLine, this.order, this.linkedPrevId, this.linkedNextId);
		card.day = this.day;
		card.start = this.start;
		return card;
	}

}
