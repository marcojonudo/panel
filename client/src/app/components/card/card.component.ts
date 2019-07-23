import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {Card} from "../../objects/card";
import {DaysService} from "../../services/days.service";
import {ChangeDetection} from "@angular/cli/lib/config/schema";

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
		console.log('checking card', this.card, this.card.width);
	}

}
