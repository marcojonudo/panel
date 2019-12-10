import {Card} from "./card";
import {UtilsService} from "../services/utils.service";

export class CardsGroup {

	private _cards: Card[];

	private _id: number;

	private _type: string;

	private _lastStart: Date;
	private _start: Date;
	private _left: number;
	private _lastEnd: Date;
	private _end: Date;

	private _lastLine: number;
	private _line: number;

	constructor(cards: Card[], left: number = undefined) {
		this.cards = cards;
		this.id = this.cards[0].id;
		this.type = this.cards[0].type;
		this.start = this.cards[0].start;
		this.end = this.cards[this.cards.length-1].end;
		this.line = this.cards[0].line;
		this.left = left;
	}

	// region Getters / setters

	get cards(): Card[] {
		return this._cards;
	}

	set cards(value: Card[]) {
		this._cards = value;
	}

	get id(): number {
		return this._id;
	}

	set id(value: number) {
		this._id = value;
	}

	get type(): string {
		return this._type;
	}

	set type(value: string) {
		this._type = value;
	}

	get start(): Date {
		return this._start;
	}

	set start(value: Date) {
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

	get end(): Date {
		return this._end;
	}

	set end(value: Date) {
		this.lastEnd = this.end;
		this._end = value;
	}

	get lastLine(): number {
		return this._lastLine;
	}

	set lastLine(value: number) {
		this._lastLine = value;
	}

	get lastEnd(): Date {
		return this._lastEnd;
	}

	set lastEnd(value: Date) {
		this._lastEnd = value;
	}

	get lastStart(): Date {
		return this._lastStart;
	}

	set lastStart(value: Date) {
		this._lastStart = value;
	}

	// endregion

	addCards(cards: Card[]): void {
		/* No es necesario ordenar las fichas por start, ya que este método se usa para añadir a un grupo que está a
		*  la izquerda, fichas de otro que está a la derecha */
		this.cards = this.cards.concat(cards);
		this.end = cards[cards.length-1].end;
	}

	clone(): CardsGroup {
		const newCardsGroup = new CardsGroup(this.cards);
		newCardsGroup.left = this.left;
		return newCardsGroup;
	}

	removeCards(fromIndex, toIndex): void {
		this.cards.splice(fromIndex, toIndex);
		this.id = this.cards[0].id;
		this.end = this.cards[this.cards.length-1].end;
	}

}
