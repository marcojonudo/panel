import {Card} from "./card";

export class CardsGroup {

	private _cards: Card[];

	private _id: number;

	private _start: Date;
	private _left: number;

	constructor(
		cards: Card[]
	) {
		this.cards = cards;
		this.id = this.cards[0].id;
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

	get start(): Date {
		return this._start;
	}

	set start(value: Date) {
		this._start = value;
	}

	get left(): number {
		return this._left;
	}

	set left(value: number) {
		this._left = value;
	}

	// endregion

	clone(): CardsGroup {
		const newCardsGroup = new CardsGroup(this.cards);
		newCardsGroup.left = this.left;
		return newCardsGroup;
	}

	// cloneCards(): void {
	// 	this.cards = this.cards.map((card) => {
	// 		/* La ficha se clona por el mismo motivo. El componente card-component recibe una ficha, pero no
	// 		*  detecta cambios si se modifica únicamente una propiedad, ya que la referencia es la misma */
	// 		let newCard = card.clone();
	// 		newCard.width = this.calcWidth(card.duration);
	// 		return newCard;
	// 	});
	// }

}
