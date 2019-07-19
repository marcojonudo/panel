import {Card} from "./card";

export class CardsGroup {

	private _cards: Card[];

	private _left: number;
	private _topLine: boolean;

	constructor(
		cards: Card[]
	) {
		this.cards = cards;
	}

	// region Getters / setters

	get cards(): Card[] {
		return this._cards;
	}

	set cards(value: Card[]) {
		this._cards = value;
	}

	get left(): number {
		return this._left;
	}

	set left(value: number) {
		this._left = value;
	}

	get topLine(): boolean {
		return this._topLine;
	}

	set topLine(value: boolean) {
		this._topLine = value;
	}

	// endregion

}
