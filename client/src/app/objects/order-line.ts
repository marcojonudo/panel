import {Article} from "./article";

export class OrderLine {

	article: Article;
	units: number;

	constructor(orderLine: any) {
		this.article = new Article(orderLine.article);
		this.units = orderLine.units;
	}

}
