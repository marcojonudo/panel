import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit,} from '@angular/core';
import {TimeService} from "../../services/time.service";
import {animate, animateChild, query, stagger, style, transition, trigger} from "@angular/animations";
import {Draggable, Droppable} from "@shopify/draggable"
import {CardPositionService} from "../../services/card-position.service";
import {CardsService} from "../../services/cards.service";
import {Card} from "../../objects/card";
import {UtilsService} from "../../services/utils.service";
import {CardsGroup} from "../../objects/cards-group";

@Component({
	selector: 'app-band',
	templateUrl: './band.component.html',
	styleUrls: ['./band.component.css'],
	// animations: [
	// 	trigger('unassigned-cards-container', [
	// 		transition(':enter', [
	// 			query('@unassigned-card', stagger(100, animateChild()))
	// 		]),
	// 	]),
	// 	trigger('unassigned-card', [
	// 		transition(':enter', [
	// 			style({ transform: 'scale(0.5)', opacity: 0 }),  // initial
	// 			animate(200,
	// 				style({ transform: 'scale(1)', opacity: 1 }))  // final
	// 		]),
	// 		transition(':leave', [
	// 			style({ transform: 'scale(1)', opacity: 1, width: '*'}),  // initial
	// 			animate(200,
	// 				style({ transform: 'scale(0.5)', opacity: 0, width: 0, margin: 0}))  // final
	// 		])
	// 	])
	// ],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class BandComponent implements OnInit, OnDestroy {

	private intervalsNumber: number;
	private unassignedCardsGroups: CardsGroup[];

	private unassignedCardsGroupsSubscription;

	constructor(
		private timeService: TimeService,
		private cardPositionService: CardPositionService,
		private cardsService: CardsService,
		private cdRef: ChangeDetectorRef
	) {
		this.intervalsNumber = this.timeService.intervalsNumber;
		this.unassignedCardsGroups = [];
	}

	ngOnInit(): void {
		this.unassignedCardsGroupsSubscription = this.cardsService.unassignedCardsGroups$.subscribe((unassignedCardsGroups: CardsGroup[]) => {
			console.time('PUSH');
			// const cards = unassignedCardsGroups.filter(cardsGroup =>
			// 	this.unassignedCardsGroups.map(group => group.id).indexOf(cardsGroup.id) < 0
			// );
			// if (cards.length) {
			// 	this.unassignedCardsGroups.push(...cards);
			// } else {
			this.unassignedCardsGroups = unassignedCardsGroups;
			// }
			// this.unassignedCardsGroups = unassignedCardsGroups;
			console.timeEnd('PUSH');

			console.log('final unassigned', this.unassignedCardsGroups);
			// this.unassignedCardsGroups.push(unassignedCardsGroups[unassignedCardsGroups.length-1]);
			console.time('PUSH DETECT');
			this.cdRef.detectChanges();
			console.timeEnd('PUSH DETECT');
		});
	}

	ngOnDestroy(): void {
		this.unassignedCardsGroupsSubscription();
	}

	check() {
		console.log('checking band')
	}

	trackById(index, item) {
		return item.id;
	}

}
