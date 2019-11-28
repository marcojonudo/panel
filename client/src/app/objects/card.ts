import {Order} from "./order";
import {UtilsService} from "../services/utils.service";
import {Group} from "./group";

export class Card {

	id: number;
	day: Date;
	lastDay: Date;
	mechanicCode: string;
	lastMechanicCode: string;
	status: string;

	start: Date;
	lastStart: Date;
	duration: number;
	end: Date;
	lastEnd: Date;
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

	constructor(card: any, initialLoad: boolean = true) {
		this.id = card.id;
		this.day = card.day ? UtilsService.parseDateFromLong(card.day) : undefined;
		this.status = card.status;
		this.mechanicCode = card.mechanicCode;
		this.start = card.start ? UtilsService.parseCompleteDate(this.day, card.start) : undefined;
		this.duration = card.duration;
		this.end = this.start ? UtilsService.addMinutes(this.start, this.duration) : undefined;
		this.line = card.line;
		this.group = new Group(card.group);
		this.order = new Order(card.order);
		this.linkedPreviousId = card.linkedPreviousId;
		this.linkedNextId = card.linkedNextId;

		this.lastDay = card.lastDay ? UtilsService.parseDateFromLong(card.lastDay) : initialLoad ? this.day : undefined;
		this.lastMechanicCode = card.lastMechanicCode ? card.lastMechanicCode : initialLoad ? this.mechanicCode : undefined;
		this.lastLine = card.lastLine != undefined ? card.lastLine : initialLoad ? this.line : undefined;
	}

	setStart(start: Date): void {
		this.lastStart = this.start;
		this.start = start;

		this.lastEnd = this.end;
		this.end = this.start ? UtilsService.addMinutes(this.start, this.duration) : this.start;
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
