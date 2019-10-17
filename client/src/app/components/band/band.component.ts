import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit,} from '@angular/core';
import {TimeService} from "../../services/time.service";
import {Draggable, Droppable} from "@shopify/draggable"
import {CardPositionService} from "../../services/card-position.service";
import {CardsService} from "../../services/cards.service";
import {CardsGroup} from "../../objects/cards-group";
import {Constants} from "../../objects/constants";
import {CardUpdate} from "../../objects/update-cards/card-update";
import {UtilsService} from "../../services/utils.service";

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

	private _unassignedCardsGroups: CardsGroup[];

	private unassignedCardsGroupsSubscription;

	constructor(
		private timeService: TimeService,
		private cardPositionService: CardPositionService,
		private cardsService: CardsService,
		private cdRef: ChangeDetectorRef
	) {
		this.unassignedCardsGroups = [];
	}

	ngOnInit(): void {
		this.unassignedCardsGroups = this.cardsService.unassignedCardsGroups;
		this.unassignedCardsGroupsSubscription = this.cardsService.unassignedCardsGroups$.subscribe((cardUpdate: CardUpdate) => {
			cardUpdate.update(this.unassignedCardsGroups);
			UtilsService.sort(this.unassignedCardsGroups, (g) => g.cards[0].order.code);
			this.cdRef.detectChanges();
		});
	}

	ngOnDestroy(): void {
		this.unassignedCardsGroupsSubscription();
	}

	// region Getters / setters

	get unassignedCardsGroups(): CardsGroup[] {
		return this._unassignedCardsGroups;
	}

	set unassignedCardsGroups(value: CardsGroup[]) {
		this._unassignedCardsGroups = value;
	}

	// endregion

	checkMarginBetweenGroups(group: CardsGroup, index: number): boolean {
		return index < this.unassignedCardsGroups.length-1 &&
			group.cards[0].order.number != this.unassignedCardsGroups[index+1].cards[0].order.number;
	}

	check() {
		if (Constants.CHECK) {
			console.log('checking band')
		}
	}

	trackById(index, item) {
		return item.id;
	}

}
