export class Order {

	private _number: number;

	constructor(number: number) {
		this._number = number;
	}

	// region Getters / setters

	get number(): number {
		return this._number;
	}

	set number(value: number) {
		this._number = value;
	}

	// endregion

}
