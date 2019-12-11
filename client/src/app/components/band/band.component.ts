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
import {UnassignedSection} from "../../objects/unassigned-sections/unassigned-section";
import {UnassignedTypeSection} from "../../objects/unassigned-sections/unassigned-type-section";
import {UnassignedFinishedSection} from "../../objects/unassigned-sections/unassigned-finished-section";

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

	private _cardSections: UnassignedSection[];
	private _section: UnassignedSection;

	private unassignedCardsGroupsSubscription: Subscription;

	constructor(
		private timeService: TimeService,
		private daysService: DaysService,
		private cardPositionService: CardPositionService,
		private cardsService: CardsService,
		private cdRef: ChangeDetectorRef
	) {
		this.unassignedCardRelativeTop = (Constants.VALUE.UNASSIGNED_BAR_HEIGHT - Constants.VALUE.LINE_HEIGHT_DEFAULT) / 2;

		this.cardSections = [
			new UnassignedTypeSection(this.cardsService, Constants.CARD_TYPE.TODAY),
			new UnassignedTypeSection(this.cardsService, Constants.CARD_TYPE.APPOINTMENT),
			new UnassignedTypeSection(this.cardsService, Constants.CARD_TYPE.PENDING),
			new UnassignedFinishedSection(this.cardsService, Constants.CARD_STATUS.FINISHED)
		];
		this.section = this.cardSections[1];
	}

	ngOnInit(): void {
		this.unassignedTypesCardsGroups = this.cardsService.unassignedTypesCardsGroups;
		this.unassignedCardsGroupsSubscription = this.cardsService.unassignedCardsGroups$
			.subscribe((cardUpdate: UnassignedCardUpdate) => {
				if (cardUpdate.type) {
					this.section = this.cardsService.unassignedSections.find(section => section.name == cardUpdate.type);
					this.cardPositionService.updateUnassignedGroupsLeft(
						this.cardsService.findUnassignedGroups(cardUpdate.type, cardUpdate.type)
					);
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

	get cardSections(): UnassignedSection[] {
		return this._cardSections;
	}

	set cardSections(value: UnassignedSection[]) {
		this._cardSections = value;
	}

	get section(): UnassignedSection {
		return this._section;
	}

	set section(value: UnassignedSection) {
		this._section = value;
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

	get finishedStatus(): string {
		return Constants.CARD_STATUS.FINISHED;
	}

	// endregion

	checkFinishedSection(section: UnassignedSection = this.section): boolean {
		return section.name == Constants.CARD_STATUS.FINISHED;
	}

	findGroupLeft(left: number, index: number): number {
		return left + (index + 1) * Constants.VALUE.UNASSIGNED_MARGIN_BETWEEN_GROUPS;
	}

	setSection(type: string): void {
		this.section = this.cardSections.find(section => section.name == type);
		this.cdRef.detectChanges();
	}

	getFinishedGroups(): CardsGroup[] {
		return this.cardsService.finishedCardsGroups;
	}

	// findUnassignedTypeGroups(type: string = this.type): CardsGroup[] {
	// 	return this.unassignedTypesCardsGroups[type];
	// }

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
