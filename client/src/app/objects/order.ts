import {UtilsService} from "../services/utils.service";
import {OrderLine} from "./order-line";

export class Order {

	number: number;
	code: string;
	state: string;
	day: Date;
	creatorCode: string;
	created: Date;
	deadline: Date;
	lines: OrderLine[];

	constructor(order: any) {
		this.number = order.number;
		this.code = order.code;
		this.state = order.state;
		this.day = UtilsService.parseDateFromLong(order.day);
		this.creatorCode = order.creatorCode;
		this.created = UtilsService.parseTimeFromString(order.created);
		this.deadline = order.deadline ? UtilsService.parseTimeFromString(order.deadline) : undefined;
		this.lines = order.lines.map(line => new OrderLine(line));
	}

}
