import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {Card} from "../../objects/card";
import {DaysService} from "../../services/days.service";
import {ChangeDetection} from "@angular/cli/lib/config/schema";
import {Constants} from "../../objects/constants";

@Component({
	selector: 'app-card',
	templateUrl: './card.component.html',
	styleUrls: ['./card.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent {

	@Input() card: Card;
	@Input() width: number;

	private CARD_STATE_COLOR: any;

	constructor() {
		this.CARD_STATE_COLOR = {
			P: '#FF0000',
			E: '#008000',
			A: '#0CC4D6'
		}
	}

	// ngAfterViewInit(): void {
		// this.cdRef.detach();
	// }

	getOrderStateColor(state: string): string {
		return this.CARD_STATE_COLOR[state];
	}

	check() {
		if (Constants.CHECK) {
			console.log('checking card', this.card, this.card.width);
		}
	}

}
