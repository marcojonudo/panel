import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit,} from '@angular/core';
import {Draggable, Droppable} from "@shopify/draggable"
import {CardPositionService} from "../../services/card-position.service";
import {CardsService} from "../../services/cards.service";
import {CardsGroup} from "../../objects/cards-group";
import {Constants} from "../../objects/constants";
import {UnassignedCardUpdate} from "../../objects/update-cards/unassigned-card-update";
import {Subscription} from "rxjs/internal/Subscription";
import {GroupedTypeCards} from "../../objects/grouped-type-cards";
import {UnassignedSection} from "../../objects/unassigned-sections/unassigned-section";
import {NotificationService} from "../../services/notification.service";
import {ContextMenuInfo} from "../../objects/context-menu/context-menu-info";

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

	@Input() contextMenuInfo: ContextMenuInfo;

	private _unassignedCardRelativeTop: number;
	private _unassignedTypesCardsGroups: GroupedTypeCards;

	private _section: UnassignedSection;

	private bandSubscription: Subscription;

	constructor(
		private cardPositionService: CardPositionService,
		private cardsService: CardsService,
		private cdRef: ChangeDetectorRef
	) {
		this.unassignedCardRelativeTop = (Constants.VALUE.UNASSIGNED_BAR_HEIGHT - Constants.VALUE.LINE_HEIGHT_DEFAULT) / 2;
		this.section = this.cardsService.unassignedSections[1];
	}

	ngOnInit(): void {
		this.unassignedTypesCardsGroups = this.cardsService.unassignedTypesCardsGroups;
		this.bandSubscription = NotificationService.band$
			.subscribe((cardUpdate: UnassignedCardUpdate) => {
				if (cardUpdate.type) {
					this.section = this.cardsService.unassignedSections.find(section => section.name == cardUpdate.type);
				}
				this.cdRef.detectChanges();
			});
	}

	ngOnDestroy(): void {
		this.bandSubscription.unsubscribe();
	}

	// region Getters / setters

	get unassignedTypesCardsGroups(): GroupedTypeCards {
		return this._unassignedTypesCardsGroups;
	}

	set unassignedTypesCardsGroups(value: GroupedTypeCards) {
		this._unassignedTypesCardsGroups = value;
	}

	get cardSections(): UnassignedSection[] {
		return this.cardsService.unassignedSections;
	}

	get section(): UnassignedSection {
		return this._section;
	}

	set section(value: UnassignedSection) {
		this._section = value;
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

	get temporalType(): string {
		return Constants.CARD_TYPE.AUXILIARY;
	}

	// endregion

	checkFinishedSection(section: UnassignedSection = this.section): boolean {
		return section.name == Constants.CARD_STATUS.FINISHED;
	}

	setSection(type: string): void {
		this.section = this.cardSections.find(section => section.name == type);
		this.cdRef.detectChanges();
	}

	checkSelectedSection(type: string, selectedSection: UnassignedSection = this.section): boolean {
		return selectedSection.name == type;
	}

	checkShowContextMenu(contextMenuInfo: ContextMenuInfo = this.contextMenuInfo): boolean {
		return contextMenuInfo != undefined;
	}

	setHiddenCardsGroup(group: CardsGroup): void {
		CardPositionService.hiddenGroup = group;
		this.cdRef.detectChanges();
	}

	checkHideGroup(sectionName: string, groupId: string): boolean {
		return sectionName != Constants.CARD_TYPE.AUXILIARY
			&& CardPositionService.hiddenGroup ? CardPositionService.hiddenGroup.id == groupId : false;
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
