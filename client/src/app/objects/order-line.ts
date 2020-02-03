export class OrderLine {

	article: {[key: string]: string};
	units: number;

	constructor(orderLine: { [key: string]: any }) {
		this.article = {name: orderLine.article.name};
		this.units = orderLine.units;
	}

}
