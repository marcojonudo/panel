import {Order} from "./order";
import {UtilsService} from "../services/utils.service";
import {Group} from "./group";

export class Card {

	id: number;
	day: Date;
	lastDay: Date;
	mechanicCode: string;
	lastMechanicCode: string;

	start: Date;
	duration: number;
	end: Date;
	line: number;
	lastLine: number;

	left: number;
	width: number;

	group: Group;

	order: Order;

	linkedNextId: number;
	linkedPreviousId: number;

	possibleLinkedNextId: boolean;
	possibleLinkedPreviousId: boolean;

	constructor(card: any) {
		this.id = card.id;
		this.day = card.day ? UtilsService.parseDateFromLong(card.day) : undefined;
		this.lastDay = card.lastDay ? UtilsService.parseDateFromLong(card.lastDay) : this.day;
		this.mechanicCode = card.mechanicCode;
		this.lastMechanicCode = card.lastMechanicCode ? card.lastMechanicCode : card.mechanicCode;
		this.start = card.start ? UtilsService.parseCompleteDate(this.day, card.start) : undefined;
		this.duration = card.duration;
		this.end = this.start ? UtilsService.addMinutes(this.start, this.duration) : undefined;
		this.line = card.line;
		this.lastLine = card.lastLine != undefined ? card.lastLine : card.line;
		this.group = new Group(card.group);
		this.order = new Order(card.order);
		this.linkedPreviousId = card.linkedPreviousId;
		this.linkedNextId = card.linkedNextId;
	}

	setWidth(widthIncrease: number, durationIncrease: number) {
		this.width += widthIncrease;
		this.setDuration(durationIncrease);
	}

	setDuration(durationIncrease: number) {
		this.duration += durationIncrease;
		this.end = UtilsService.addMinutes(this.start, this.duration);
	}

	setDay(day: Date): void {
		this.lastDay = this.day;
		this.day = day;
	}

	setMechanicCode(mechanicCode: string): void {
		this.lastMechanicCode = this.mechanicCode;
		this.mechanicCode = mechanicCode;
	}

	setLine(line: number): void {
		this.lastLine = this.line;
		this.line = line;
	}

}
