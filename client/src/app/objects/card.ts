import {Order} from "./order";
import {UtilsService} from "../services/utils.service";
import {Group} from "./group";
import {Client} from "./client";
import {Vehicle} from "./vehicle";
import {CardsService} from "../services/cards.service";

export class Card {

	panelId: string;
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
	type: string;
	code: string;

	order: Order;

	client: Client;

	vehicle: Vehicle;

	linkedNext: Card;
	linkedPrevious: Card;

	dividedPrevious: Card;
	dividedNext: Card;

	divisionIndex: number;

	possibleLinkedNext: boolean;
	possibleLinkedPrevious: boolean;

	constructor(card: any, initialLoad: boolean = true) {
		this.type = card.type;
		this.code = card.code;
		this.day = card.day ? UtilsService.parseDateFromLong(card.day) : undefined;
		this.status = card.status;
		this.mechanicCode = card.mechanicCode;
		this.start = card.start ? UtilsService.parseCompleteDate(this.day, card.start) : undefined;
		this.duration = card.duration;
		this.end = this.start ? UtilsService.addMinutes(this.start, this.duration) : undefined;
		this.line = card.line;
		this.group = new Group(card.group);
		this.order = new Order(card.order);
		this.client = card.client ? new Client(card.client) : undefined;
		this.vehicle = card.vehicle ? new Vehicle(card.vehicle) : undefined;
		this.linkedPrevious = card.linkedPrevious ? new Card(card.linkedPrevious) : undefined;
		this.linkedNext = card.linkedNext ? new Card(card.linkedNext) : undefined;
		this.dividedPrevious = card.dividedPrevious ? new Card(card.dividedPrevious) : undefined;
		this.dividedNext = card.dividedNext ? new Card(card.dividedNext) : undefined;
		this.divisionIndex = card.divisionIndex;
		this.panelId = CardsService.buildPanelId(this);

		this.lastDay = card.lastDay ? UtilsService.parseDateFromLong(card.lastDay) : initialLoad ? this.day : undefined;
		this.lastMechanicCode = card.lastMechanicCode ? card.lastMechanicCode : initialLoad ? this.mechanicCode : undefined;
		this.lastLine = card.lastLine != undefined ? card.lastLine : initialLoad ? this.line : undefined;
		this.lastStart = card.lastStart != undefined ? card.lastStart : initialLoad ? this.start : undefined;
		this.lastEnd = card.lastEnd != undefined ? card.lastEnd : initialLoad ? this.end : undefined;
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

	clone(): Card {
		const params = {
			type: this.type,
			code: this.code,
			status: this.status,
			duration: this.duration,
			divisionIndex: this.divisionIndex,
			group: new Group(this.group),
			order: new Order(this.order)
		};
		const card = new Card(params);
		card.width = this.width;
		return card;
	}

}
