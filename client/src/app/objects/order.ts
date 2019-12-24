import {UtilsService} from "../services/utils.service";

export class Order {

	number: number;
	code: string;
	state: string;
	day: Date;
	creatorCode: string;
	created: Date;
	deadline: Date;

	// constructor(number: number) {
	// 	this._number = number;
	// }

	constructor(order: any) {
		this.number = order.number;
		this.code = order.code;
		this.state = order.state;
		this.day = UtilsService.parseDateFromLong(order.day);
		this.creatorCode = order.creatorCode;
		console.log(111, order.created);
		this.created = UtilsService.parseTimeFromString(order.created);
		this.deadline = order.deadline ? UtilsService.parseTimeFromString(order.deadline) : undefined;
	}

}
