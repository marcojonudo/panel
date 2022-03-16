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
	mechanicCode: string;
	status: string;

	start: Dayjs;
	duration: number;
	end: Dayjs;
	line: number;

	left: number;
	width: number;

	group: Group;
	type: string;
	code: string;

	pending: Pending;

	order: Order;

	client: Client;

	vehicle: Vehicle;

	linkedPrevious: Card;
	linkedNext: Card;
	linkedIndex: number;

	dividedPrevious: Card;
	dividedNext: Card;
	divisionIndex: number;

	vehiclePosition: string;

	possibleLinkedNext: boolean;
	possibleLinkedPrevious: boolean;

	constructor(card: any) {
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
		this.linkedIndex = card.linkedIndex;
		this.dividedPrevious = card.dividedPrevious ? new Card(card.dividedPrevious) : undefined;
		this.dividedNext = card.dividedNext ? new Card(card.dividedNext) : undefined;
		this.divisionIndex = card.divisionIndex;
		this.vehiclePosition = card.vehiclePosition;

		this.panelId = this.order ? CardsService.buildPanelId(this) : undefined;
	}

	setStart(start: Dayjs): void {
		this.start = start;
		this.end = this.start ? this.start.add(this.duration, Constants.DAY_JS.m) : this.start;
	}

	setDuration(duration: number, width: number = undefined) {
		this.duration = duration;
		this.end = this.start ? this.start.add(this.duration, Constants.DAY_JS.m) : undefined;
		this.width = width ? width : DimensionsService.calcWidthFromDuration(this.duration);
	}

	setDay(day: Dayjs): void {
		this.day = day;
	}

	setMechanicCode(mechanicCode: string): void {
		this.mechanicCode = mechanicCode;
	}

	setLine(line: number): void {
		this.line = line;
	}

	setDivisionIndex(divisionIndex: number): void {
		this.divisionIndex = divisionIndex;
		this.panelId = CardsService.buildPanelId(this);
	}

	clone(): Card {
		const card = new Card({
			type: this.type,
			code: this.code,
			line: this.line,
			status: this.status,
			mechanicCode: this.mechanicCode,
			duration: this.duration,
			linkedIndex: this.linkedIndex,
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
		card.panelId = CardsService.buildPanelId(card);
		card.width = this.width;
		return card;
	}

}
