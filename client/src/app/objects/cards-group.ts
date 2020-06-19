import {Card} from "./card";
import {UtilsService} from "../services/utils.service";
import {Constants} from "./constants";
import {DimensionsService} from "../services/dimensions.service";
import {Dayjs} from "dayjs";

export class CardsGroup {

	private _cards: Card[];

	private _id: string;

	private _type: string;
	private _status: string;

	day: Dayjs;
	mechanicCode: string;

	private _lastStart: Dayjs;
	private _start: Dayjs;
	private _left: number;
	private _lastEnd: Dayjs;
	private _end: Dayjs;

	private _lastLine: number;
	private _line: number;

	private _coordinates: Coordinates;

	cut: boolean;
	mode: string;

	highlight: boolean;

	constructor(cards: Card[], left: number = undefined) {
		this.cards = cards;
		this.id = this.cards[0].panelId;
		this.type = this.cards[0].type;
		this.status = this.cards[0].status;
		this.day = this.cards[0].day;
		this.mechanicCode = this.cards[0].mechanicCode;
		this.start = this.cards[0].start;
		this.end = this.cards[this.cards.length-1].end;
		this.line = this.cards[0].line;
		this.left = left;
		this.mode = Constants.GROUP_MODE.DRAG;
		this.highlight = false;
	}

	// region Getters / setters

	get cards(): Card[] {
		return this._cards;
	}

	set cards(value: Card[]) {
		this._cards = value;
	}

	get id(): string {
		return this._id;
	}

	set id(value: string) {
		this._id = value;
	}

	get type(): string {
		return this._type;
	}

	set type(value: string) {
		this._type = value;
	}

	get status(): string {
		return this._status;
	}

	set status(value: string) {
		this._status = value;
	}

	get start(): Dayjs {
		return this._start;
	}

	set start(value: Dayjs) {
		this.lastStart = this.start;
		this._start = value;
	}

	get left(): number {
		return this._left;
	}

	set left(value: number) {
		this._left = value;
	}

	get line(): number {
		return this._line;
	}

	set line(value: number) {
		this.lastLine = this.line;
		this._line = value;
	}

	get end(): Dayjs {
		return this._end;
	}

	set end(value: Dayjs) {
		this.lastEnd = this.end;
		this._end = value;
	}

	get lastLine(): number {
		return this._lastLine;
	}

	set lastLine(value: number) {
		this._lastLine = value;
	}

	get lastEnd(): Dayjs {
		return this._lastEnd;
	}

	set lastEnd(value: Dayjs) {
		this._lastEnd = value;
	}

	get lastStart(): Dayjs {
		return this._lastStart;
	}

	set lastStart(value: Dayjs) {
		this._lastStart = value;
	}

	get coordinates(): Coordinates {
		return this._coordinates;
	}

	set coordinates(value: Coordinates) {
		this._coordinates = value;
	}

	// endregion

	setStart(start: Dayjs): void {
		this.start = start;
		this.left = this.start ? DimensionsService.calcLeftFromStart(this.start) : undefined;
		this.end = this.start ? this.start.add(this.findDuration(), Constants.DAY_JS.m) : undefined;
	}

	addCards(cards: Card[]): void {
		/* No es necesario ordenar las fichas por start, ya que este método se usa para añadir a un grupo que está a
		*  la izquerda, fichas de otro que está a la derecha */
		this.cards = this.cards.concat(cards);
		this.end = cards[cards.length-1].end;
	}

	clone(cloneCards: boolean = false): CardsGroup {
		const newCardsGroup = new CardsGroup(this.cards);
		newCardsGroup.left = this.left;
		if (cloneCards) {
			newCardsGroup.cards = this.cards.map((card: Card) => card.clone());
		}
		return newCardsGroup;
	}

	removeCard(cardId: string): void {
		this.cards = this.cards.filter((card: Card) => card.panelId != cardId);
		this.id = this.cards[0].panelId;
		this.setStart(this.cards[0].start);
		this.end = this.cards[this.cards.length-1].end;
	}

	removeCards(fromIndex: number, toIndex: number): void {
		this.cards = this.cards.slice(fromIndex, toIndex);
		this.id = this.cards[0].panelId;
		this.setStart(this.cards[0].start);
		this.end = this.cards[this.cards.length-1].end;
	}

	findDuration(): number {
		return UtilsService.sum(this.cards, Constants.PROPERTY.DURATION);
	}

}
