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
export class CardComponent
{

	@Input() card: Card;

	constructor(
		private cdRef: ChangeDetectorRef
	) { }

	// ngAfterViewInit(): void {
		// this.cdRef.detach();
	// }

	check() {
		if (Constants.CHECK) {
			console.log('checking card', this.card, this.card.width);
		}
	}

}
