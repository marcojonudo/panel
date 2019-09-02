import {UtilsService} from "../services/utils.service";

export class Order {

	private _number: number;
	private _code: string;
	private _state: string;
	private _day: Date;
	private _creatorCode: string;
	private _deadline: Date;

	// constructor(number: number) {
	// 	this._number = number;
	// }

	constructor(order: any) {
		this.number = order.number;
		this.code = order.code;
		this.state = order.state;
		this.day = UtilsService.parseDateFromLong(order.day);
		this.creatorCode = order.creatorCode;
		this.deadline = order.deadline ? UtilsService.parseTimeFromString(order.deadline) : undefined;
	}

	// region Getters / setters

	get number(): number {
		return this._number;
	}

	set number(value: number) {
		this._number = value;
	}

	get deadline(): Date {
		return this._deadline;
	}

	set deadline(value: Date) {
		this._deadline = value;
	}

	get day(): Date {
		return this._day;
	}

	set day(value: Date) {
		this._day = value;
	}

	get creatorCode(): string {
		return this._creatorCode;
	}

	set creatorCode(value: string) {
		this._creatorCode = value;
	}

	get state(): string {
		return this._state;
	}
	set state(value: string) {
		this._state = value;
	}

	get code(): string {
		return this._code;
	}

	set code(value: string) {
		this._code = value;
	}

	// endregion

}
