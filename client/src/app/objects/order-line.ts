export class OrderLine {

	description: string;
	units: number;

	constructor(orderLine: { [key: string]: any }) {
		this.description = orderLine.article.name;
		this.units = orderLine.units;
	}

}
