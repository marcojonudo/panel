import {
	ChangeDetectionStrategy, ChangeDetectorRef,
	Component,
	OnDestroy, OnInit,
} from '@angular/core';
import {Constants} from "../../objects/constants";
import {Subscription} from "rxjs/internal/Subscription";
import {CardsService} from "../../services/cards.service";
import {MechanicLineUpdate} from "../../objects/update-days-cards/mechanic-line-update";
import {CardsGroup} from "../../objects/cards-group";
import {Skill} from "../../objects/skill";
import {CommonService} from "../../services/common.service";
import {NotificationService} from "../../services/notification.service";
import {UtilsService} from "../../services/utils.service";
import {DimensionsService} from "../../services/dimensions.service";
import {MechanicsService} from "../../services/mechanics.service";
import {DaysAssignedGroups} from "../../objects/days-assigned-groups";
import {CardPositionService} from "../../services/card-position.service";

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
	private _showSkills: boolean;

	private _assignedDaysCardsGroups: DaysAssignedGroups;

	private _skills: Skill[];

	private _oneDayMode: boolean;
	private _maxScheduleHours: number[];
	private _maxScheduleWidth: number;
	private _maxScheduleMaxWidth: number;

	private _dayCardUpdate: MechanicLineUpdate;

	private relativeContainer: boolean;
	private scrollLeft: number;
	private scrollTop: number;

	private oneDayModeSubscription: Subscription;
	private maxScheduleWidthSubscription: Subscription;
	private assignedCardsGroupsSubscription: Subscription;
	private skillsSubscription: Subscription;

	constructor(
		private cardsService: CardsService,
		private mechanicsService: MechanicsService,
		private commonService: CommonService,
		private cardPositionService: CardPositionService,
		private cdRef: ChangeDetectorRef
	) {
		this.days = this.mechanicsService.days;
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

		this.skills = [];

		this.showNonexistentScheduleMessage = !this.checkTodayScheduleExists();
		this.dayContainerWidth = window.innerWidth - Constants.VALUE.TOOLS_BAR_WIDTH;
	}

	ngOnInit(): void {
		this.assignedDaysCardsGroups = this.cardsService.assignedDaysCardsGroups;
		this.assignedCardsGroupsSubscription = NotificationService.mechanicLine$
				.subscribe((mechanicLineUpdate: MechanicLineUpdate) => {
			this.mechanicLineUpdate = mechanicLineUpdate;
			this.cdRef.detectChanges();
		});

		this.oneDayModeSubscription = NotificationService.oneDayMode$.subscribe((oneDayMode: boolean) => {
			this.oneDayMode = oneDayMode;
			DimensionsService.updateMaxSchedule(this.oneDayMode);
			this.maxScheduleHours = DimensionsService.maxScheduleHours;
			this.maxScheduleWidth = DimensionsService.maxScheduleWidth;
			this.maxScheduleMaxWidth = DimensionsService.maxScheduleMaxWidth;
			// this.maxScheduleHours = this.timeService.updateMaxSchedule(oneDayMode);
			this.showNonexistentScheduleMessage = this.oneDayMode && !this.checkTodayScheduleExists();
			// this.timeService.calcMaxScheduleWidth(oneDayMode);
			this.cdRef.detectChanges();
		});
		this.maxScheduleWidthSubscription = NotificationService.maxScheduleWidth$.subscribe(maxScheduleWidth => {
			/* Se debe usar un observer distinto al anterior, en lugar de obtener el maxScheduleWidth directamente
			*  del valor retornado por calcMaxScheduleWidth, porque esa cifra también se puede calcular a partir
			*  del slider */
			console.log('HOOOOOOOOOOOOOOOOOOOLA');
			this.maxScheduleWidth = maxScheduleWidth;
			this.cardPositionService.updateDimensions(
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

		this.skillsSubscription = this.commonService.skills$.subscribe(skills => {
			if (skills.length) {
				skills.forEach((parent: Skill) => {
					this.skills.push(parent);
					parent.children.forEach((child: Skill) => {
						this.skills.push(child);
					});
				});
			} else {
				this.skills = skills;
			}
			this.showSkills = this.skills.length != 0;
			this.cdRef.detectChanges();
		});
	}

	ngOnDestroy(): void {
		this.oneDayModeSubscription.unsubscribe();
		this.maxScheduleWidthSubscription.unsubscribe();
		this.assignedCardsGroupsSubscription.unsubscribe();
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

	get showSkills(): boolean {
		return this._showSkills;
	}

	set showSkills(value: boolean) {
		this._showSkills = value;
	}

	get skills(): Skill[] {
		return this._skills;
	}

	set skills(value: Skill[]) {
		this._skills = value;
	}

	get skillsDetailsRight(): number {
		return Constants.VALUE.TOOLS_BAR_WIDTH + Constants.VALUE.DAY_PANEL_WIDTH;
	}

	get mechanicLineUpdate(): MechanicLineUpdate {
		return this._dayCardUpdate;
	}

	set mechanicLineUpdate(value: MechanicLineUpdate) {
		this._dayCardUpdate = value;
	}

	// endregion

	private checkTriggerCd(day: Date, mechanicLineUpdate: MechanicLineUpdate = this.mechanicLineUpdate): MechanicLineUpdate {
		let update = undefined;
		if (mechanicLineUpdate) {
			update = !mechanicLineUpdate.day || day.getTime() == mechanicLineUpdate.day.getTime() ? mechanicLineUpdate : undefined;
		}
		return update;
	}

	private checkTodayScheduleExists(today: Date = this.today): boolean {
		return this.mechanicsService.findDayMechanics(today) != undefined;
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
