import {Order} from "./order";
import {UtilsService} from "../services/utils.service";
import {Group} from "./group";

export class Card {

	id: number;
	day: Date;
	mechanicCode: string;

	start: Date;
	duration: number;
	end: string;
	line: number;

	left: number;
	width: number;

	group: Group;

	order: Order;

	linkedNextId: number;
	linkedPrevId: number;

	constructor(card: any) {
		this.id = card.id;
		this.day = card.day ? UtilsService.parseDateFromLong(card.day) : undefined;
		this.mechanicCode = card.mechanicCode;
		this.start = card.start ? UtilsService.parseCompleteDate(this.day, card.start) : undefined;
		this.duration = card.duration;
		this.end = card.end;
		this.line = card.line;
		this.group = new Group(card.group);
		this.order = new Order(card.order);
		this.linkedPrevId = card.linkedPrevId;
		this.linkedNextId = card.linkedNextId;
	}

}
