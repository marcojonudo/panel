import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit,} from '@angular/core';
import {TimeService} from "../../services/time.service";
import {Draggable, Droppable} from "@shopify/draggable"
import {CardPositionService} from "../../services/card-position.service";
import {CardsService} from "../../services/cards.service";
import {CardsGroup} from "../../objects/cards-group";
import {Constants} from "../../objects/constants";
import {CardUpdate} from "../../objects/update-cards/card-update";
import {UtilsService} from "../../services/utils.service";
import {DaysService} from "../../services/days.service";
import {Subscription} from "rxjs/internal/Subscription";

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

	private _unassignedCardRelativeTop: number;
	private _unassignedCardsGroups: CardsGroup[];

	private _hiddenCardsGroup: CardsGroup;

	private unassignedCardsGroupsSubscription: Subscription;

	constructor(
		private timeService: TimeService,
		private daysService: DaysService,
		private cardPositionService: CardPositionService,
		private cardsService: CardsService,
		private cdRef: ChangeDetectorRef
	) {
		this.unassignedCardsGroups = [];
		this.unassignedCardRelativeTop = (Constants.VALUE.UNASSIGNED_BAR_HEIGHT - Constants.VALUE.LINE_HEIGHT_DEFAULT) / 2;
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
		this.unassignedCardsGroupsSubscription.unsubscribe();
	}

	// region Getters / setters

	get unassignedCardsGroups(): CardsGroup[] {
		return this._unassignedCardsGroups;
	}

	set unassignedCardsGroups(value: CardsGroup[]) {
		this._unassignedCardsGroups = value;
	}

	get unassignedDropzoneType(): string {
		return Constants.DROPZONE_TYPE.UNASSIGNED;
	}

	get unassignedBarHeight(): number {
		return Constants.VALUE.UNASSIGNED_BAR_HEIGHT;
	}

	get lineDefaultHeight() {
		return Constants.VALUE.LINE_HEIGHT_DEFAULT;
	}

	get unassignedCardRelativeTop(): number {
		return this._unassignedCardRelativeTop;
	}

	set unassignedCardRelativeTop(value: number) {
		this._unassignedCardRelativeTop = value;
	}

	get hiddenCardsGroup(): CardsGroup {
		return this._hiddenCardsGroup;
	}

	set hiddenCardsGroup(value: CardsGroup) {
		this._hiddenCardsGroup = value;
	}

	// endregion

	findGroupLeft(left: number, index: number): number {
		return left + (index + 1) * Constants.VALUE.UNASSIGNED_MARGIN_BETWEEN_GROUPS;
	}

	setHiddenCardsGroup(group: CardsGroup): void {
		this.hiddenCardsGroup = group;
		this.cdRef.detectChanges();
	}

	checkHideGroup(groupId: number): boolean {
		return this.hiddenCardsGroup ? this.hiddenCardsGroup.id == groupId : false;
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
