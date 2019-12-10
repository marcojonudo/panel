import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit,} from '@angular/core';
import {TimeService} from "../../services/time.service";
import {Draggable, Droppable} from "@shopify/draggable"
import {CardPositionService} from "../../services/card-position.service";
import {CardsService} from "../../services/cards.service";
import {CardsGroup} from "../../objects/cards-group";
import {Constants} from "../../objects/constants";
import {UnassignedCardUpdate} from "../../objects/update-cards/unassigned-card-update";
import {UtilsService} from "../../services/utils.service";
import {DaysService} from "../../services/days.service";
import {Subscription} from "rxjs/internal/Subscription";
import {GroupedTypeCards} from "../../objects/grouped-type-cards";

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
	private _unassignedTypesCardsGroups: GroupedTypeCards;

	private _cardTypes: string[];
	private _type: string;

	private unassignedCardsGroupsSubscription: Subscription;

	constructor(
		private timeService: TimeService,
		private daysService: DaysService,
		private cardPositionService: CardPositionService,
		private cardsService: CardsService,
		private cdRef: ChangeDetectorRef
	) {
		this.unassignedCardRelativeTop = (Constants.VALUE.UNASSIGNED_BAR_HEIGHT - Constants.VALUE.LINE_HEIGHT_DEFAULT) / 2;

		this.cardTypes = [Constants.CARD_TYPE.TODAY, Constants.CARD_TYPE.APPOINTMENT, Constants.CARD_TYPE.PENDING];
		this.type = Constants.CARD_TYPE.APPOINTMENT;
	}

	ngOnInit(): void {
		this.unassignedTypesCardsGroups = this.cardsService.unassignedTypesCardsGroups;
		this.unassignedCardsGroupsSubscription = this.cardsService.unassignedCardsGroups$
			.subscribe((cardUpdate: UnassignedCardUpdate) => {
				if (cardUpdate.type) {
					this.cardPositionService.updateUnassignedTypeLeft(cardUpdate.type);
				} else {
					this.cardPositionService.updateUnassignedLeft();
				}
				this.cdRef.detectChanges();
			});
	}

	ngOnDestroy(): void {
		this.unassignedCardsGroupsSubscription.unsubscribe();
	}

	// region Getters / setters

	get unassignedTypesCardsGroups(): GroupedTypeCards {
		return this._unassignedTypesCardsGroups;
	}

	set unassignedTypesCardsGroups(value: GroupedTypeCards) {
		this._unassignedTypesCardsGroups = value;
	}

	get cardTypes(): string[] {
		return this._cardTypes;
	}

	set cardTypes(value: string[]) {
		this._cardTypes = value;
	}

	get type(): string {
		return this._type;
	}

	set type(value: string) {
		this._type = value;
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

	get todayType(): string {
		return Constants.CARD_TYPE.TODAY;
	}

	get appointmentType(): string {
		return Constants.CARD_TYPE.APPOINTMENT;
	}

	get pendingType(): string {
		return Constants.CARD_TYPE.PENDING;
	}

	// endregion

	findGroupLeft(left: number, index: number): number {
		return left + (index + 1) * Constants.VALUE.UNASSIGNED_MARGIN_BETWEEN_GROUPS;
	}

	setType(type: string): void {
		this.type = type;
		this.cdRef.detectChanges();
	}

	findUnassignedTypeGroups(type: string = this.type): CardsGroup[] {
		return this.unassignedTypesCardsGroups[type];
	}

	setHiddenCardsGroup(group: CardsGroup): void {
		this.cardPositionService.hiddenGroup = group;
		this.cdRef.detectChanges();
	}

	checkHideGroup(groupId: number): boolean {
		return this.cardPositionService.hiddenGroup ? this.cardPositionService.hiddenGroup.id == groupId : false;
	}

	check() {
		if (Constants.CHECK) {
			console.log('checking band', this.unassignedTypesCardsGroups)
		}
	}

	trackById(index, item) {
		return item.id;
	}

}
