import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component, ElementRef,
	OnDestroy,
	OnInit, ViewChild,
} from '@angular/core';
import {CardPositionService} from "../../services/card-position.service";
import {CardsService} from "../../services/cards.service";
import {CardsGroup} from "../../objects/cards-group";
import {Constants} from "../../objects/constants";
import {Subscription} from "rxjs/internal/Subscription";
import {GroupedTypeCards} from "../../objects/grouped-type-cards";
import {UnassignedSection} from "../../objects/unassigned-sections/unassigned-section";
import {NotificationService} from "../../services/notification.service";
import {GroupsTriggerMap} from "../../objects/trigger-cd/trigger-maps/groups-trigger-map";
import {GroupUpdate} from "../../objects/trigger-cd/update-objects/groups/group-update";
import {BandUpdate} from "../../objects/trigger-cd/update-objects/band/band-update";
import {MechanicsService} from "../../services/mechanics.service";
import {Employee} from "../../objects/employee";
import {Card} from "../../objects/card";

@Component({
	selector: 'app-band',
	templateUrl: './band.component.html',
	styleUrls: ['./band.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class BandComponent implements OnInit, OnDestroy {

	private _unassignedCardRelativeTop: number;
	private _unassignedTypesCardsGroups: GroupedTypeCards;

	private _section: UnassignedSection;

	private groupsTriggerMap: GroupsTriggerMap;

	private bandSubscription: Subscription;

	groups: CardsGroup[];
	validatedAuxiliaryEmployee: boolean;
	auxiliaryEmployee: Employee;

	constructor(
		private cardPositionService: CardPositionService,
		private cardsService: CardsService,
		private cdRef: ChangeDetectorRef
	) {
		this.unassignedCardRelativeTop = (Constants.VALUE.UNASSIGNED_BAR_HEIGHT - Constants.VALUE.LINE_HEIGHT_DEFAULT) / 2;
		this.section = CardsService.unassignedSections[1];
		this.groupsTriggerMap = new GroupsTriggerMap(this.section.findGroups());
		this.setGroups();
	}

	ngOnInit(): void {
		this.unassignedTypesCardsGroups = CardsService.unassignedTypesGroups;
		this.bandSubscription = NotificationService.band$.subscribe((bandUpdate: BandUpdate) => {
			if (bandUpdate.section) {
				this.setSection(bandUpdate.section);
			}
			if (bandUpdate.groupsUpdate) {
				bandUpdate.groupsUpdate.forEach((groupUpdate: GroupUpdate) => {
					groupUpdate.updateTriggerMap(this.groupsTriggerMap, groupUpdate.groupId);
				});
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
		return CardsService.unassignedSections;
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

	get auxiliaryType(): string {
		return Constants.CARD_TYPE.AUXILIARY;
	}

	get auxiliaryUserPlaceholder(): string {
		return Constants.AUXILIARY_USER_PLACEHOLDER;
	}

	get auxiliaryGroup(): CardsGroup {
		return CardsService.auxiliaryGroup;
	}

	// endregion

	setGroups(section: UnassignedSection = this.section): void {
		this.groups = section.findGroups();
		this.handleGroupsTriggerMap(this.groups);
	}

	handleGroupsTriggerMap(groups: CardsGroup[], groupsTriggerMap: GroupsTriggerMap = this.groupsTriggerMap): void {
		groups.forEach((group: CardsGroup) => {
			if (!(group.id in groupsTriggerMap)) {
				groupsTriggerMap[group.id] = undefined;
			}
		});
		for (const groupId of Object.keys(groupsTriggerMap)) {
			const existentGroup = groups.find((g: CardsGroup) => g.id == groupId);
			if (!existentGroup) {
				delete groupsTriggerMap[groupId];
			}
		}
	}

	findSection(sectionType: string, sections: UnassignedSection[] = this.cardSections): UnassignedSection {
		return sections.find(section => section.name == sectionType);
	}

	findGroupsLength(
		sectionType: string,
		section: UnassignedSection = this.section,
		groups: CardsGroup[] = this.groups
	): number {
		if (section.name == sectionType) {
			return groups.length;
		}
		return this.findSection(sectionType).findGroups().length;
	}

	checkUpdateGroup(groupId: string, groupsTriggerMap: GroupsTriggerMap = this.groupsTriggerMap): GroupUpdate {
		return groupsTriggerMap[groupId];
	}

	checkFinishedSection(section: UnassignedSection = this.section): boolean {
		return section.name == Constants.CARD_STATUS.FINISHED;
	}

	setSection(type: string): void {
		this.resetAuxiliaryUser();
		this.section = this.findSection(type);
		this.setGroups();
		this.cdRef.detectChanges();
	}

	checkSelectedSection(type: string, selectedSection: UnassignedSection = this.section): boolean {
		return selectedSection.name == type;
	}

	checkAuxiliarySection(name: string): boolean {
		return name == this.auxiliaryType;
	}

	checkIntroducedAuxiliaryUser(code: string, employees: Employee[] = MechanicsService.employees): void {
		if (code.length == Constants.VALUE.EMPLOYEE_CODE_LENGTH) {
			this.validatedAuxiliaryEmployee = true;
			this.auxiliaryEmployee = employees.find((e: Employee) => e.code == code);
		} else {
			this.validatedAuxiliaryEmployee = false;
		}
		this.cdRef.detectChanges();
	}

	checkInvalidAuxiliaryUser(
		validated: boolean = this.validatedAuxiliaryEmployee,
		auxiliaryUser: Employee = this.auxiliaryEmployee
	): boolean {
		return validated && auxiliaryUser == undefined;
	}

	resetAuxiliaryUser(): void {
		this.validatedAuxiliaryEmployee = false;
		this.auxiliaryEmployee = undefined;
	}

	setHiddenCardsGroup(group: CardsGroup): void {
		CardPositionService.hiddenGroup = group;
		this.cdRef.detectChanges();
	}

	checkHideGroup(sectionName: string, groupId: string): boolean {
		return CardPositionService.hiddenGroup ? CardPositionService.hiddenGroup.id == groupId : false;
	}

	addAuxiliaryGroup(group: CardsGroup): void {
		CardsService.auxiliaryGroup = new CardsGroup(
			(this.auxiliaryGroup ? this.auxiliaryGroup.cards : []).concat(group.cards.map((c: Card) => c.clone())),
			10
		);
		CardsService.updateCardsLinks(CardsService.auxiliaryGroup.cards);
		CardsService.auxiliaryGroup.cards.forEach((card: Card, i: number) => {
			CardsService.updateAuxiliaryOrderCode(card, group, i);
		});
		this.cdRef.detectChanges();
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
