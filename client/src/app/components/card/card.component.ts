import {Component, Input} from '@angular/core';
import {Card} from "../../objects/card";

@Component({
	selector: 'app-card',
	templateUrl: './card.component.html',
	styleUrls: ['./card.component.css']
})
export class CardComponent {

	@Input() card: Card;

	constructor() {
	}

	check() {
		console.log('checking card', this.card.id);
	}

}
