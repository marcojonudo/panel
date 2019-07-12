import {Component, Input} from '@angular/core';
import {Card} from "../../objects/card";
import {DaysService} from "../../services/days.service";

@Component({
	selector: 'app-card',
	templateUrl: './card.component.html',
	styleUrls: ['./card.component.css']
})
export class CardComponent {

	@Input() card: Card;

	constructor() { }

	check() {
		console.log('checking card', this.card.id);
	}

}
