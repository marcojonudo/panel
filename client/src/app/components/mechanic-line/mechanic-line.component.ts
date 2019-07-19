import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit,} from '@angular/core';
import {TimeService} from "../../services/time.service";
import {Draggable, Droppable} from "@shopify/draggable"
import {CardsService} from "../../services/cards.service";
import {Mechanic} from "../../objects/mechanic";
import {DaysService} from "../../services/days.service";
import {Card} from "../../objects/card";
import {ResizeEvent} from "angular-resizable-element";
import {CardsGroup} from "../../objects/cards-group";

@Component({
	selector: 'app-mechanic-line',
	templateUrl: './mechanic-line.component.html',
	styleUrls: ['./mechanic-line.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MechanicLineComponent implements OnInit, OnDestroy {

	private hours: number[];
	private quarters: string[];

	private assignedCards: any[];

	private cardsSubscription: any;

	@Input() mechanic: Mechanic;
	@Input() day: string;

	private cardsGroups: CardsGroup[];

	constructor(
		private timeService: TimeService,
		private cardsService: CardsService,
		private daysService: DaysService,
		private cdRef: ChangeDetectorRef
	) {
		this.hours = this.timeService.getHours();
		this.quarters = this.timeService.getQuarters();
		this.assignedCards = [{id: 6, width: 150, left: 180, top: 120}];
	}

	ngOnInit(): void {
		if (this.cardsService.assignedDaysCardsGroups$[this.day][this.mechanic.position]) {
			this.cardsSubscription = this.cardsService.assignedDaysCardsGroups$[this.day][this.mechanic.position].subscribe(cardsGroup => {
				this.cardsGroups = cardsGroup;
				this.cdRef.detectChanges();
			});
		}
	}

	ngOnDestroy(): void {
		this.cardsSubscription.unsubscribe();
	}

	trackByItem(index, item) {
		return item;
	}

	get lineHeight$() {
		return this.daysService.lineHeight$;
	}

	check() {
		console.log('checking mechanic line', this.day, this.mechanic, this.cardsGroups);
	}

	test(event) {
		console.log('FINISH RESIZING', event);
	}

}
