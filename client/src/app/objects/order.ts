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
		this.day = order.day ? UtilsService.parseDateFromLong(order.day) : undefined;
		this.creatorCode = order.creatorCode;
		this.created = order.created ? UtilsService.parseTimeFromString(order.created) : undefined;
		this.deadline = order.deadline ? UtilsService.parseTimeFromString(order.deadline) : undefined;
		this.lines = order.lines ? order.lines.map(line => new OrderLine(line)) : [];
	}

	clone(): Order {
		const order = new Order({});
		order.number = this.number;
		order.code = this.code;
		order.state = this.state;
		order.day = this.day;
		order.creatorCode = this.creatorCode;
		order.created = this.created;
		order.deadline = this.deadline;
		order.lines = this.lines;
		return order;
	}

}
