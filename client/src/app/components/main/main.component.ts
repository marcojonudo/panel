import {
	ChangeDetectionStrategy, ChangeDetectorRef,
	Component,
	OnDestroy, OnInit,
} from '@angular/core';
import {Constants} from "../../objects/constants";
import {Subscription} from "rxjs/internal/Subscription";
import {CardsService} from "../../services/cards.service";
import {MechanicUpdate} from "../../objects/update-days-cards/mechanic-update";
import {Skill} from "../../objects/skill";
import {NotificationService} from "../../services/notification.service";
import {UtilsService} from "../../services/utils.service";
import {DimensionsService} from "../../services/dimensions.service";
import {MechanicsService} from "../../services/mechanics.service";
import {DaysAssignedGroups} from "../../objects/days-assigned-groups";
import {CardPositionService} from "../../services/card-position.service";
import {DayMechanicSkills} from "../../objects/skills-update/day-mechanic-skills";
import {MechanicInfoUpdate} from "../../objects/update-days-cards/mechanic-info-update";
import {DaysMechanicSkills} from "../../objects/days-mechanic-skills";
import {DaysCardDetails} from "../../objects/days-card-details";
import {DayCardDetails} from "../../objects/card-details-update/day-card-details";
import {Card} from "../../objects/card";
import {QuartersSaturation} from "../../objects/quarters-saturation";
import {DaysQuartersSaturation} from "../../objects/quarters-saturation-update/days-quarters-saturation";
import {DayQuartersSaturation} from "../../objects/quarters-saturation-update/day-quarters-saturation";
import {DaysContextMenu} from "../../objects/context-menu-update/days-context-menu";
import {ContextMenuInfo} from "../../objects/context-menu-info";

@Component({
	selector: 'app-main',
	templateUrl: './main.component.html',
	styleUrls: ['./main.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent implements OnInit, OnDestroy {

	private _days: Date[];
	private _today: Date;
	private itemSize: number;
	private _displayScrollbar: boolean;
	private _showNonexistentScheduleMessage: boolean;
	private _dayContainerWidth: number;

	private _assignedDaysCardsGroups: DaysAssignedGroups;

	private _daysMechanicSkills: DaysMechanicSkills;
	private _daysCardDetails: DaysCardDetails;
	private _daysQuartersSaturation: DaysQuartersSaturation;

	private _daysContextMenu: DaysContextMenu;

	private _oneDayMode: boolean;
	private _maxScheduleHours: number[];
	private _maxScheduleWidth: number;
	private _maxScheduleMaxWidth: number;

	private _mechanicLineUpdate: MechanicUpdate;
	private _mechanicInfoUpdate: MechanicUpdate;

	private _contextMenuInfo: ContextMenuInfo;

	private relativeContainer: boolean;
	private scrollLeft: number;
	private scrollTop: number;

	private oneDayModeSubscription: Subscription;
	private maxScheduleWidthSubscription: Subscription;
	private mechanicLineSubscription: Subscription;
	private skillsSubscription: Subscription;
	private cardDetailsSubscription: Subscription;
	private quartersSaturationSubscription: Subscription;
	private contextMenuSubscription: Subscription;

	constructor(
		private cardsService: CardsService,
		private mechanicsService: MechanicsService,
		private cardPositionService: CardPositionService,
		private cdRef: ChangeDetectorRef
	) {
		this.days = this.mechanicsService.days;
		this.initDaysUpdateObjects();

		const today = UtilsService.clearTime(new Date()).getTime();
		this.today = this.days.find(day => day.getTime() == today);
		this.oneDayMode = true;
		// this.maxScheduleHours = this.timeService.updateMaxSchedule(this.oneDayMode);
		this.maxScheduleHours = DimensionsService.maxScheduleHours;
		this.maxScheduleWidth = DimensionsService.maxScheduleWidth;
		this.maxScheduleMaxWidth = DimensionsService.maxScheduleMaxWidth;
		// this.itemSize = this.mechanicsService.mechanics.length * (Constants.VALUE.LINE_HEIGHT_DEFAULT + 10);

		this.relativeContainer = true;
		this.scrollLeft = 0;
		this.scrollTop = 0;

		this.showNonexistentScheduleMessage = !this.checkTodayScheduleExists();
		this.dayContainerWidth = window.innerWidth - Constants.VALUE.TOOLS_BAR_WIDTH;
	}

	ngOnInit(): void {
		this.assignedDaysCardsGroups = this.cardsService.assignedDaysCardsGroups;
		this.mechanicLineSubscription = NotificationService.mechanicLine$
				.subscribe((mechanicLineUpdate: MechanicUpdate) => {
			this.mechanicLineUpdate = mechanicLineUpdate;
			this.cdRef.detectChanges();
		});

		// this.daysQuartersSaturation[this.today.getTime()].quartersSaturation = this.cardsService.quartersSaturation;
		this.quartersSaturationSubscription = NotificationService.quartersSaturation$
				.subscribe((dayQuartersSaturation: DayQuartersSaturation) => {
			this.daysQuartersSaturation[dayQuartersSaturation.day.getTime()] = dayQuartersSaturation;
			this.cdRef.detectChanges();
		});

		this.contextMenuSubscription = NotificationService.contextMenu$
				.subscribe((contextMenuInfo: ContextMenuInfo) => {
			this.contextMenuInfo = contextMenuInfo;
			this.cdRef.detectChanges();
		});

		this.oneDayModeSubscription = NotificationService.oneDayMode$.subscribe((oneDayMode: boolean) => {
			this.oneDayMode = oneDayMode;
			DimensionsService.updateMaxSchedule(this.oneDayMode);
			this.maxScheduleHours = DimensionsService.maxScheduleHours;
			this.maxScheduleWidth = DimensionsService.maxScheduleWidth;
			this.maxScheduleMaxWidth = DimensionsService.maxScheduleMaxWidth;
			CardPositionService.updateDimensions(
				this.cardsService.unassignedSections,
				this.cardsService.assignedDaysCardsGroups
			);
			this.showNonexistentScheduleMessage = this.oneDayMode && !this.checkTodayScheduleExists();
			this.cdRef.detectChanges();
		});
		this.maxScheduleWidthSubscription = NotificationService.maxScheduleWidth$.subscribe(maxScheduleWidth => {
			/* Se debe usar un observer distinto al anterior, en lugar de obtener el maxScheduleWidth directamente
			*  del valor retornado por calcMaxScheduleWidth, porque esa cifra también se puede calcular a partir
			*  del slider */
			this.maxScheduleWidth = maxScheduleWidth;
			CardPositionService.updateDimensions(
				this.cardsService.unassignedSections,
				this.cardsService.assignedDaysCardsGroups
			);
			NotificationService.notifyAll();
			this.cdRef.detectChanges();
		});

		// /* Observer utilizado para determinar si es necesario mostrar o no la scrollbar */
		// this.daysService.lineHeight$.subscribe((lineHeight: number) => {
		// 	this.displayScrollbar = this.daysService.checkDisplayScrollbar(
		// 		//TODO Modificar comparación de maxScheduleWidth
		// 		this.timeService.gridHeight - (this.maxScheduleWidth == 100 ? 0 : 7),
		// 		this.timeService.today,
		// 		lineHeight
		// 	);
		// 	this.cdRef.detectChanges();
		// });

		this.skillsSubscription = NotificationService.skills$.subscribe((dayMechanicSkills: DayMechanicSkills) => {
			dayMechanicSkills.skills = this.buildAllSkillsArray(dayMechanicSkills.skills);
			this.daysMechanicSkills[dayMechanicSkills.day.getTime()] = dayMechanicSkills;
			this.mechanicInfoUpdate = new MechanicInfoUpdate(dayMechanicSkills.day, dayMechanicSkills.mechanicCode);
			this.cdRef.detectChanges();
		});
		this.cardDetailsSubscription = NotificationService.cardDetails$.subscribe((dayCardDetails: DayCardDetails) => {
			dayCardDetails.card = this.daysCardDetails[dayCardDetails.day.getTime()].card ? undefined : dayCardDetails.card;
			this.daysCardDetails[dayCardDetails.day.getTime()] = dayCardDetails;
			this.cdRef.detectChanges();
		});
	}

	private buildAllSkillsArray(parentSkills: Skill[]): Skill[] {
		const skills = [];
		parentSkills.forEach((parent: Skill) => {
			skills.push(parent);
			parent.children.forEach((child: Skill) => {
				skills.push(child);
			});
		});
		return skills;
	}

	ngOnDestroy(): void {
		this.oneDayModeSubscription.unsubscribe();
		this.maxScheduleWidthSubscription.unsubscribe();
		this.mechanicLineSubscription.unsubscribe();
		this.skillsSubscription.unsubscribe();
		this.cardDetailsSubscription.unsubscribe();
		this.quartersSaturationSubscription.unsubscribe();
	}

	// region Getters / setters

	get days(): Date[] {
		return this._days;
	}

	set days(value: Date[]) {
		this._days = value;
	}

	get today(): Date {
		return this._today;
	}

	set today(value: Date) {
		this._today = value;
	}

	get assignedDaysCardsGroups(): DaysAssignedGroups {
		return this._assignedDaysCardsGroups;
	}

	set assignedDaysCardsGroups(value: DaysAssignedGroups) {
		this._assignedDaysCardsGroups = value;
	}

	get displayScrollbar(): boolean {
		return this._displayScrollbar;
	}

	set displayScrollbar(value: boolean) {
		this._displayScrollbar = value;
	}

	get showNonexistentScheduleMessage(): boolean {
		return this._showNonexistentScheduleMessage;
	}

	set showNonexistentScheduleMessage(value: boolean) {
		this._showNonexistentScheduleMessage = value;
	}

	get oneDayMode(): boolean {
		return this._oneDayMode;
	}

	set oneDayMode(value: boolean) {
		this._oneDayMode = value;
	}

	get maxScheduleWidth(): number {
		return this._maxScheduleWidth;
	}

	set maxScheduleWidth(value: number) {
		this._maxScheduleWidth = value;
	}

	get maxScheduleMaxWidth(): number {
		return this._maxScheduleMaxWidth;
	}

	set maxScheduleMaxWidth(value: number) {
		this._maxScheduleMaxWidth = value;
	}

	get maxScheduleHours(): number[] {
		return this._maxScheduleHours;
	}

	set maxScheduleHours(value: number[]) {
		this._maxScheduleHours = value;
	}

	get dayPanelWidth(): number {
		return Constants.VALUE.DAY_PANEL_WIDTH;
	}

	get dayContainerWidth(): number {
		return this._dayContainerWidth;
	}

	set dayContainerWidth(value: number) {
		this._dayContainerWidth = value;
	}

	get skillsDetailsRight(): number {
		return Constants.VALUE.TOOLS_BAR_WIDTH + Constants.VALUE.DAY_PANEL_WIDTH;
	}

	get mechanicLineUpdate(): MechanicUpdate {
		return this._mechanicLineUpdate;
	}

	set mechanicLineUpdate(value: MechanicUpdate) {
		this._mechanicLineUpdate = value;
	}

	get mechanicInfoUpdate(): MechanicUpdate {
		return this._mechanicInfoUpdate;
	}

	set mechanicInfoUpdate(value: MechanicUpdate) {
		this._mechanicInfoUpdate = value;
	}

	get daysMechanicSkills(): DaysMechanicSkills {
		return this._daysMechanicSkills;
	}

	set daysMechanicSkills(value: DaysMechanicSkills) {
		this._daysMechanicSkills = value;
	}

	get daysCardDetails(): DaysCardDetails {
		return this._daysCardDetails;
	}

	set daysCardDetails(value: DaysCardDetails) {
		this._daysCardDetails = value;
	}

	get daysQuartersSaturation(): DaysQuartersSaturation {
		return this._daysQuartersSaturation;
	}

	set daysQuartersSaturation(value: DaysQuartersSaturation) {
		this._daysQuartersSaturation = value;
	}

	get daysContextMenu(): DaysContextMenu {
		return this._daysContextMenu;
	}

	set daysContextMenu(value: DaysContextMenu) {
		this._daysContextMenu = value;
	}

	get contextMenuInfo(): ContextMenuInfo {
		return this._contextMenuInfo;
	}

	set contextMenuInfo(value: ContextMenuInfo) {
		this._contextMenuInfo = value;
	}

	// endregion

	private initDaysUpdateObjects(days: Date[] = this.days): void {
		this.daysMechanicSkills = {};
		this.daysCardDetails = {};
		this.daysQuartersSaturation = {};
		this.daysContextMenu = {};
		days.forEach((day: Date) => {
			this.daysMechanicSkills[day.getTime()] = new DayMechanicSkills();
			this.daysCardDetails[day.getTime()] = new DayCardDetails();
			this.daysQuartersSaturation[day.getTime()] = new DayQuartersSaturation(
				day,
				this.cardsService.checkQuarterSaturation(day)
			);
			this.daysContextMenu[day.getTime()] = undefined;
		});
	}

	checkTriggerLineCd(day: Date, mechanicLineUpdate: MechanicUpdate = this.mechanicLineUpdate): MechanicUpdate {
		let update = undefined;
		if (mechanicLineUpdate) {
			update = !mechanicLineUpdate.day || day.getTime() == mechanicLineUpdate.day.getTime() ? mechanicLineUpdate : undefined;
		}
		return update;
	}

	findQuartersSaturation(
		day: Date,
		daysQuartersSaturation: DaysQuartersSaturation = this.daysQuartersSaturation
	): QuartersSaturation {
		return daysQuartersSaturation[day.getTime()].quartersSaturation;
	}

	findAssignedContextMenuInfo(contextMenuInfo: ContextMenuInfo = this.contextMenuInfo): ContextMenuInfo {
		return contextMenuInfo && contextMenuInfo.group.start ? contextMenuInfo : undefined;
	}

	findUnassignedContextMenuInfo(contextMenuInfo: ContextMenuInfo = this.contextMenuInfo): ContextMenuInfo {
		return contextMenuInfo && !contextMenuInfo.group.start ? contextMenuInfo : undefined;
	}

	checkTriggerInfoCd(
		day: Date,
		daysMechanicSkills: DaysMechanicSkills = this.daysMechanicSkills
	): DayMechanicSkills {
		return daysMechanicSkills[day.getTime()];
	}

	private checkTodayScheduleExists(today: Date = this.today): boolean {
		return this.mechanicsService.findDayMechanics(today) != undefined;
	}

	checkShowCardDetails(day: Date, daysCardDetails: DaysCardDetails = this.daysCardDetails): boolean {
		return daysCardDetails[day.getTime()].card != undefined;
	}

	findCard(day: Date, daysCardDetails: DaysCardDetails = this.daysCardDetails): Card {
		return daysCardDetails[day.getTime()].card;
	}

	checkShowSkills(day: Date, daysMechanicSkills: DaysMechanicSkills = this.daysMechanicSkills): boolean {
		return daysMechanicSkills[day.getTime()].skills.length != 0;
	}

	findSkills(day: Date, daysMechanicSkills: DaysMechanicSkills = this.daysMechanicSkills): Skill[] {
		return daysMechanicSkills[day.getTime()].skills;
	}

	trackByDay(index, item) {
		return item
	}

	check() {
		if (Constants.CHECK) {
			console.log('checking main');
		}
	}

}
