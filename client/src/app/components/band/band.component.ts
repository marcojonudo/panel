import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit,} from '@angular/core';
import {TimeService} from "../../services/time.service";
import {animate, animateChild, query, stagger, style, transition, trigger} from "@angular/animations";
import {Draggable, Droppable} from "@shopify/draggable"
import {CardPositionService} from "../../services/card-position.service";
import {CardsService} from "../../services/cards.service";
import {Card} from "../../objects/card";
import {UtilsService} from "../../services/utils.service";
import {CardsGroup} from "../../objects/cards-group";
import {Constants} from "../../objects/constants";

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
		this.unassignedCardsGroupsSubscription = this.cardsService.unassignedCardsGroups$.subscribe((unassignedCardsGroups: CardsGroup[]) => {
			const removedGroupIndex = this.unassignedCardsGroups.findIndex(group =>
				!unassignedCardsGroups.find(g => g.id == group.id)
			);
			/* this.unassignedCardsGroups tiene un grupo que no tiene unassignedCardsGroup; es decir, se ha
			*  sacado un grupo de la cinta */
			if (removedGroupIndex > -1) {
				this.unassignedCardsGroups.splice(removedGroupIndex, 1);
			} else {
				/* Si la longitud es la misma, es que se ha modificado el zoom (ancho) del grid y de las fichas */
				if (this.unassignedCardsGroups.length === unassignedCardsGroups.length) {
					this.unassignedCardsGroups = unassignedCardsGroups;
				} else {
					/* Si no falta sobra niguna ficha en this.unassignedCardsGroup, significa que unassigendCardsGroups
					*  tiene una nueva; es decir, se ha soltado un grupo en la cinta (última posición) */
					this.unassignedCardsGroups.push(unassignedCardsGroups[unassignedCardsGroups.length - 1]);
				}
			}

			console.log('DETECT UNASSIGNED CHANGES');
			console.time('DETECT UNASSIGNED CHANGES');
			this.cdRef.detectChanges();
			console.timeEnd('DETECT UNASSIGNED CHANGES');
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

	check() {
		if (Constants.CHECK) {
			console.log('checking band')
		}
	}

	trackById(index, item) {
		return item.id;
	}

}
