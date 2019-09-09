import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {Card} from "../../objects/card";
import {CardPositionService} from "../../services/card-position.service";
import {Constants} from "../../objects/constants";

@Component({
	selector: 'app-helper-card',
	templateUrl: './helper-card.component.html',
	styleUrls: ['./helper-card.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class HelperCardComponent {

	@Input() card: Card;

	constructor() {}

	check(): void {
		if (Constants.CHECK) {
			console.log('checking helper card', this.card);
		}
	}

}
