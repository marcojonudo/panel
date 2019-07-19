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
			// if (this.unassignedCardsGroups.length) {
			// 	console.log('aa', this.unassignedCardsGroups);
			// 	this.unassignedCardsGroups = unassignedCardsGroups;
			// 	this.unassignedCardsGroups.push(unassignedCardsGroups[0]);
			// 	console.log(this.unassignedCardsGroups[0]);
			// 	console.log(this.unassignedCardsGroups[this.unassignedCardsGroups.length - 1]);
			// } else {
			// 	console.log('bb', unassignedCardsGroups);
			this.unassignedCardsGroups = unassignedCardsGroups;
			// }
			console.log(this.unassignedCardsGroups === unassignedCardsGroups);
			console.log(this.unassignedCardsGroups === [...unassignedCardsGroups]);
			console.log('THIIIIIS', this.unassignedCardsGroups, this.unassignedCardsGroups[0].cards[0].width);
			console.log('groupList');
			console.time('groupList');
			// if (groupedUnassignedCards) {
			// 	if (this.a == 0) {
			// 		this.groupedUnassignedCards = UtilsService.groupList(groupedUnassignedCards, (card) => card.order.number);
			// 		this.a = 1;
			// 	} else {
			// 		this.groupedUnassignedCards.splice(0, 1);
			// 	}
			// } else {
			// if (this.a != 1) {
			// 	this.groupedUnassignedCards = UtilsService.groupList(unassignedCards, (card) => card.order.number);
			// } else {
			// 	this.groupedUnassignedCards.splice(0, 1);
			// }
			// }
			console.timeEnd('groupList');
			// console.log('AAAAAAAAAAAAAAAAAAAAAAAA', UtilsService.groupList(unassignedCards, (card) => card.order.number));
			console.log('groupListChanges');
			console.time('groupListChanges');
			this.cdRef.detectChanges();
			console.timeEnd('groupListChanges');
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

	forceCardCd() {
		/* Force card CD to save the new positions, once the dragged card is outside the unassigned list */
		this.cdRef.detectChanges();
	}

	getPreviousGroupWidth(cards: Card[][], index): number {
		console.log(cards.filter((card, i) => i < index));
		let totalWidth = 0;
		for (let i = 0; i < index; i++) {
			totalWidth += cards[i].reduce((sum, current) => sum + current.width, 0);
			console.log('totalWidth', totalWidth, cards[i]);
		}
		console.log(totalWidth);
		return totalWidth;
	}

}
