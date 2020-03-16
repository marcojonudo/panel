import {UtilsService} from "../services/utils.service";
import {OrderLine} from "./order-line";
import {Dayjs} from "dayjs";
import * as dayjs from "dayjs";

export class Order {

	number: number;
	code: string;
	state: string;
	day: Dayjs;
	creatorCode: string;
	created: Dayjs;
	deadline: Dayjs;
	lines: OrderLine[];

	constructor(order: any) {
		this.number = order.number;
		this.code = order.code;
		this.state = order.state;
		this.day = order.day ? dayjs(order.day) : undefined;
		this.creatorCode = order.creatorCode;
		this.created = order.created ? UtilsService.parseTime(order.created) : undefined;
		this.deadline = order.deadline ? UtilsService.parseTime(order.deadline) : undefined;
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
