import {Order} from "./order";
import {UtilsService} from "../services/utils.service";
import {Group} from "./group";
import {Client} from "./client";
import {Vehicle} from "./vehicle";
import {CardsService} from "../services/cards.service";
import {DimensionsService} from "../services/dimensions.service";
import {Dayjs} from "dayjs";
import * as dayjs from "dayjs";
import {Constants} from "./constants";
import {Pending} from "./pending";

export class Card {

	panelId: string;
	day: Dayjs;
	lastDay: Dayjs;
	mechanicCode: string;
	lastMechanicCode: string;
	status: string;
	lastStatus: string;

	start: Dayjs;
	lastStart: Dayjs;
	duration: number;
	end: Dayjs;
	lastEnd: Dayjs;
	line: number;
	lastLine: number;

	left: number;
	width: number;

	group: Group;
	type: string;
	code: string;

	pending: Pending;

	order: Order;

	client: Client;

	vehicle: Vehicle;

	linkedNext: Card;
	linkedPrevious: Card;

	divisionIndex: number;
	vehiclePosition: string;

	possibleLinkedNext: boolean;
	possibleLinkedPrevious: boolean;

	highlight: boolean;

	constructor(card: any, initialLoad: boolean = true) {
		this.type = card.type;
		this.code = card.code;
		this.day = card.day ? dayjs(card.day) : undefined;
		this.status = card.status;
		this.mechanicCode = card.mechanicCode;
		this.start = card.start ? UtilsService.parseTime(card.start, this.day) : undefined;
		this.duration = card.duration;
		this.width = DimensionsService.calcWidthFromDuration(card.duration);
		this.end = this.start ? this.start.add(this.duration, Constants.DAY_JS.m) : undefined;
		this.line = card.line;
		this.group = card.group ? new Group(card.group) : undefined;
		this.pending = card.pending ? new Pending(card.pending) : undefined;
		this.order = card.order ? new Order(card.order) : undefined;
		this.client = card.client ? new Client(card.client) : undefined;
		this.vehicle = card.vehicle ? new Vehicle(card.vehicle) : undefined;
		this.linkedPrevious = card.linkedPrevious ? new Card(card.linkedPrevious) : undefined;
		this.linkedNext = card.linkedNext ? new Card(card.linkedNext) : undefined;
		this.divisionIndex = card.divisionIndex;
		this.vehiclePosition = card.vehiclePosition;

		this.panelId = this.order ? CardsService.buildPanelId(this) : undefined;

		this.lastDay = card.lastDay ? dayjs(card.lastDay) : initialLoad ? this.day : undefined;
		this.lastMechanicCode = card.lastMechanicCode ? card.lastMechanicCode : initialLoad ? this.mechanicCode : undefined;
		this.lastLine = card.lastLine != undefined ? card.lastLine : initialLoad ? this.line : undefined;
		this.lastStart = card.lastStart != undefined ? card.lastStart : initialLoad ? this.start : undefined;
		this.lastEnd = card.lastEnd != undefined ? card.lastEnd : initialLoad ? this.end : undefined;
		this.highlight = false;
	}

	setStart(start: Dayjs): void {
		this.lastStart = this.start;
		this.start = start;

		this.lastEnd = this.end;
		this.end = this.start ? this.start.add(this.duration, Constants.DAY_JS.m) : this.start;
	}

	setDuration(duration: number, width: number = undefined) {
		this.duration = duration;
		this.end = this.start ? this.start.add(this.duration, Constants.DAY_JS.m) : undefined;
		this.width = width ? width : DimensionsService.calcWidthFromDuration(this.duration);
	}

	setDay(day: Dayjs): void {
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

	setDivisionIndex(divisionIndex: number): void {
		this.divisionIndex = divisionIndex;
		this.panelId = CardsService.buildPanelId(this);
	}

	setStatus(status: string): void {
		this.lastStatus = this.status;
		this.status = status;
	}

	clone(): Card {
		const card = new Card({
			type: this.type,
			code: this.code,
			line: this.line,
			lastLine: this.lastLine,
			status: this.status,
			mechanicCode: this.mechanicCode,
			lastMechanicCode: this.lastMechanicCode,
			duration: this.duration,
			divisionIndex: this.divisionIndex,
			vehiclePosition: this.vehiclePosition
		});
		card.day = this.day;
		card.start = this.start;
		card.end = this.end;
		card.group = this.group.clone();
		card.pending = this.pending.clone();
		card.order = this.order.clone();
		card.client = this.client ? this.client.clone() : undefined;
		card.vehicle = this.vehicle ? this.vehicle.clone() : undefined;
		card.lastDay = this.lastDay;
		card.lastStart = this.lastStart;
		card.lastEnd = this.lastEnd;
		card.panelId = CardsService.buildPanelId(card);
		card.width = this.width;
		return card;
	}

}
