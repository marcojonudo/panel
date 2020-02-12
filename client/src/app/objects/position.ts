export class Position {

	left: number;
	right: number;
	top: number;
	bottom: number;

	constructor(left: number, right: number, top: number, bottom: number = undefined) {
		this.left = left;
		this.right = right;
		this.top = top;
		this.bottom = bottom;
	}

}
