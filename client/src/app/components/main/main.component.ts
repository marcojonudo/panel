import {
	ChangeDetectionStrategy, ChangeDetectorRef,
	Component, ElementRef,
	OnDestroy, OnInit, Renderer2,
} from '@angular/core';
import {Constants} from "../../objects/constants";
import {Subscription} from "rxjs/internal/Subscription";
import {CardsService} from "../../services/cards.service";
import {MechanicUpdate} from "../../objects/update-days-cards/mechanic-update";
import {NotificationService} from "../../services/notification.service";
import {UtilsService} from "../../services/utils.service";
import {DimensionsService} from "../../services/dimensions.service";
import {MechanicsService} from "../../services/mechanics.service";
import {DaysAssignedGroups} from "../../objects/days-assigned-groups";
import {CardPositionService} from "../../services/card-position.service";
import {DayMechanicSkills} from "../../objects/skills-update/day-mechanic-skills";
import {DaysMechanicSkills} from "../../objects/skills-update/days-mechanic-skills";
import {QuartersSaturation} from "../../objects/quarters-saturation";
import {DaysQuartersSaturation} from "../../objects/quarters-saturation-update/days-quarters-saturation";
import {DayQuartersSaturation} from "../../objects/quarters-saturation-update/day-quarters-saturation";
import {ContextMenuInfo} from "../../objects/context-menu/context-menu-info";
import {Mechanic} from "../../objects/mechanic";
import {interval} from "rxjs/internal/observable/interval";
import {DaysLateralPanelInfo} from "../../objects/days-lateral-panel-info";
import {LateralPanelInfo} from "../../objects/lateral-panel-info/lateral-panel-info";
import {DayLateralPanelInfo} from "../../objects/lateral-panel-info/day-lateral-panel-info";
import {AppointmentsService} from "../../services/appointments.service";
import {DaysAppointmentsCounterUpdate} from "../../objects/appointments-counter-update/days-appointments-counter-update";
import {DayAppointmentsCounterUpdate} from "../../objects/appointments-counter-update/day-appointments-counter-update";
import {MechanicLineUpdate} from "../../objects/update-days-cards/mechanic-line-update";
import {Toast} from "../../objects/toasts/toast";
import {DomSanitizer} from "@angular/platform-browser";
import {GroupContextMenuInfo} from "../../objects/context-menu/group-context-menu-info";
import {DragScheduleContextMenuInfo} from "../../objects/context-menu/drag-schedule-context-menu-info";
import {Coordinates} from "../../objects/coordinates";

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
	private _showNonexistentScheduleMessage: boolean;
	private _dayContainerWidth: number;

	private _assignedDaysCardsGroups: DaysAssignedGroups;

	private _daysMechanicSkills: DaysMechanicSkills;
	private _daysLateralInfo: DaysLateralPanelInfo;
	private _daysQuartersSaturation: DaysQuartersSaturation;
	private _daysAppointmentsCounterUpdate: DaysAppointmentsCounterUpdate;

	private _oneDayMode: boolean;
	private _maxScheduleHours: number[];
	private _maxScheduleWidth: number;
	private _maxScheduleMaxWidth: number;

	private _toast: Toast;

	private _cursor: string;

	private _mechanicLineUpdate: MechanicUpdate;
	private _mechanicInfoUpdate: MechanicUpdate;

	private _contextMenuInfo: ContextMenuInfo;

	private _timeIndicatorLeft: number;
	private _initialScrollLeft: number;

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
	private onlyAppointmentsModeSubscription: Subscription;
	private lateralInfoSubscription: Subscription;
	private appointmentsCounterSubscription: Subscription;
	private toastSubscription: Subscription;
	private dragSchedulesSubscription: Subscription;

	private appointmentsTypesContextMenuListener: () => void;

	constructor(
		private cardsService: CardsService,
		private mechanicsService: MechanicsService,
		private cardPositionService: CardPositionService,
		private appointmentsService: AppointmentsService,
		private cdRef: ChangeDetectorRef,
		private sanitizer: DomSanitizer,
		private element: ElementRef,
		private renderer: Renderer2
	) {
		this.days = this.mechanicsService.days;
		this.initDaysUpdateObjects();

		const today = UtilsService.clearTime(new Date()).getTime();
		this.today = this.days.find(day => day.getTime() == today);
		this.oneDayMode = true;
		this.maxScheduleHours = DimensionsService.maxScheduleHours;
		this.maxScheduleWidth = DimensionsService.maxScheduleWidth;
		this.maxScheduleMaxWidth = DimensionsService.maxScheduleMaxWidth;
		// this.itemSize = this.mechanicsService.mechanics.length * (Constants.VALUE.LINE_HEIGHT_DEFAULT + 10);

		this.relativeContainer = true;
		this.scrollLeft = 0;
		this.scrollTop = 0;

		this.showNonexistentScheduleMessage = !this.checkTodayScheduleExists();
		this.dayContainerWidth = window.innerWidth - Constants.VALUE.TOOLS_BAR_WIDTH;

		this.timeIndicatorLeft = this.calcTimeIndicatorLeft();
		this.cursor = Constants.MAIN_CURSOR.DEFAULT;
	}

	ngOnInit(): void {
		this.assignedDaysCardsGroups = this.cardsService.assignedDaysCardsGroups;
		this.mechanicLineSubscription = NotificationService.mechanicLine$
				.subscribe((mechanicLineUpdate: MechanicUpdate) => {
			this.mechanicLineUpdate = mechanicLineUpdate;
			this.cdRef.detectChanges();
		});

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
			this.mechanicLineUpdate = new MechanicLineUpdate(Constants.MECHANIC_LINE_UPDATE_TYPE.MAX_SCHEDULE_WIDTH);
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
			this.timeIndicatorLeft = this.calcTimeIndicatorLeft();
			NotificationService.notifyAll();
			this.cdRef.detectChanges();
		});

		// /* Observer utilizado para determinar si es necesario mostrar o no la scrollbar */
		// this.daysService.lineHeight$.subscribe((lineHeight: number) => {
		// 	this.displayVerticalScrollbar = this.daysService.checkDisplayScrollbar(
		// 		//TODO Modificar comparación de maxScheduleWidth
		// 		this.timeService.gridContainerHeight - (this.maxScheduleWidth == 100 ? 0 : 7),
		// 		this.timeService.today,
		// 		lineHeight
		// 	);
		// 	this.cdRef.detectChanges();
		// });

		this.lateralInfoSubscription = NotificationService.lateralInfo$
				.subscribe((dayLateralInfo: DayLateralPanelInfo) => {
			if (dayLateralInfo.info && dayLateralInfo.info.type == Constants.LATERAL_PANEL_INFO_TYPE.SKILLS) {
				dayLateralInfo.info.handle(this.daysMechanicSkills, dayLateralInfo.day);
			}
			this.daysLateralInfo[dayLateralInfo.day.getTime()] = dayLateralInfo;
			this.cdRef.detectChanges();
		});

		this.onlyAppointmentsModeSubscription = NotificationService.onlyAppointmentsMode$.subscribe(() => {
			this.cdRef.detectChanges();
		});

		this.appointmentsCounterSubscription = NotificationService.appointmentsCounter$
				.subscribe((dayAppointmentsCounters: DayAppointmentsCounterUpdate) => {
			this.daysAppointmentsCounterUpdate[dayAppointmentsCounters.day.getTime()] = dayAppointmentsCounters;
			this.cdRef.detectChanges();
		});

		this.toastSubscription = NotificationService.toast$.subscribe((toast: Toast) => {
			this.toast = toast;
			this.cdRef.detectChanges();
		});

		this.dragSchedulesSubscription = NotificationService.mainCursor$.subscribe((cursor: string) => {
			this.cursor = cursor;

			this.appointmentsTypesContextMenuListener = this.renderer.listen(
				this.element.nativeElement,
				Constants.EVENT.CONTEXT_MENU,
				this.openContextMenu.bind(this)
			);
			this.cdRef.detectChanges();
		});

		interval(Constants.VALUE.TIME_INDICATOR_INTERVAL).subscribe(() => {
			this.timeIndicatorLeft = this.calcTimeIndicatorLeft();
			this.cdRef.detectChanges();
		});

		this.initialScrollLeft = this.calcTimeIndicatorLeft() - Constants.VALUE.MECHANIC_INFO_WIDTH * 2;
	}

	ngOnDestroy(): void {
		this.oneDayModeSubscription.unsubscribe();
		this.maxScheduleWidthSubscription.unsubscribe();
		this.mechanicLineSubscription.unsubscribe();
		this.skillsSubscription.unsubscribe();
		this.cardDetailsSubscription.unsubscribe();
		this.quartersSaturationSubscription.unsubscribe();
		this.onlyAppointmentsModeSubscription.unsubscribe();
		this.lateralInfoSubscription.unsubscribe();
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

	get displayVerticalScrollbar(): boolean {
		return DimensionsService.displayVerticalScrollbar;
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

	get dayContainerWidth(): number {
		return this._dayContainerWidth;
	}

	set dayContainerWidth(value: number) {
		this._dayContainerWidth = value;
	}

	get lateralPanelRight(): number {
		return Constants.VALUE.TOOLS_BAR_WIDTH + Constants.VALUE.LATERAL_PANEL_WIDTH;
	}

	get mechanicLineUpdate(): MechanicUpdate {
		return this._mechanicLineUpdate;
	}

	set mechanicLineUpdate(value: MechanicUpdate) {
		this._mechanicLineUpdate = value;
	}

	get daysMechanicSkills(): DaysMechanicSkills {
		return this._daysMechanicSkills;
	}

	set daysMechanicSkills(value: DaysMechanicSkills) {
		this._daysMechanicSkills = value;
	}

	get daysQuartersSaturation(): DaysQuartersSaturation {
		return this._daysQuartersSaturation;
	}

	set daysQuartersSaturation(value: DaysQuartersSaturation) {
		this._daysQuartersSaturation = value;
	}

	get contextMenuInfo(): ContextMenuInfo {
		return this._contextMenuInfo;
	}

	set contextMenuInfo(value: ContextMenuInfo) {
		this._contextMenuInfo = value;
	}

	get onlyAppointmentsMode(): boolean {
		return MechanicsService.onlyAppointmentsMode;
	}

	get showAppointmentsName(): boolean {
		return MechanicsService.showAppointmentsName;
	}

	get timeIndicatorLeft(): number {
		return this._timeIndicatorLeft;
	}

	set timeIndicatorLeft(value: number) {
		this._timeIndicatorLeft = value;
	}

	get initialScrollLeft(): number {
		return this._initialScrollLeft;
	}

	set initialScrollLeft(value: number) {
		this._initialScrollLeft = value;
	}

	get daysLateralInfo(): DaysLateralPanelInfo {
		return this._daysLateralInfo;
	}

	set daysLateralInfo(value: DaysLateralPanelInfo) {
		this._daysLateralInfo = value;
	}

	get daysAppointmentsCounterUpdate(): DaysAppointmentsCounterUpdate {
		return this._daysAppointmentsCounterUpdate;
	}

	set daysAppointmentsCounterUpdate(value: DaysAppointmentsCounterUpdate) {
		this._daysAppointmentsCounterUpdate = value;
	}

	get toolsBarWidth(): number {
		return Constants.VALUE.TOOLS_BAR_WIDTH;
	}

	get toast(): Toast {
		return this._toast;
	}

	set toast(value: Toast) {
		this._toast = value;
	}

	get cursor(): string {
		return this._cursor;
	}

	set cursor(value: string) {
		this._cursor = value;
	}

	// endregion

	private initDaysUpdateObjects(days: Date[] = this.days): void {
		this.daysMechanicSkills = {};
		this.daysQuartersSaturation = {};
		this.daysLateralInfo = {};
		this.daysAppointmentsCounterUpdate = {};
		days.forEach((day: Date) => {
			this.daysMechanicSkills[day.getTime()] = new DayMechanicSkills();
			this.daysQuartersSaturation[day.getTime()] = new DayQuartersSaturation(
				day,
				this.cardsService.checkQuarterSaturation(day)
			);
			this.daysLateralInfo[day.getTime()] = new DayLateralPanelInfo();
			this.daysAppointmentsCounterUpdate[day.getTime()] = new DayAppointmentsCounterUpdate(day)
		});
	}

	findDayMechanics(day: Date): Mechanic[] {
		return this.mechanicsService.findDayMechanics(day);
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
		return contextMenuInfo && contextMenuInfo.type == Constants.CONTEXT_MENU_TYPE.GROUP &&
			(<GroupContextMenuInfo> contextMenuInfo).group.start ? contextMenuInfo : undefined;
	}

	findUnassignedContextMenuInfo(contextMenuInfo: ContextMenuInfo = this.contextMenuInfo): ContextMenuInfo {
		return contextMenuInfo && contextMenuInfo.type == Constants.CONTEXT_MENU_TYPE.GROUP &&
			!(<GroupContextMenuInfo> contextMenuInfo).group.start ? contextMenuInfo : undefined;
	}

	checkShowDragScheduleContextMenu(contextMenuInfo: ContextMenuInfo = this.contextMenuInfo): boolean {
		return contextMenuInfo && contextMenuInfo.type == Constants.CONTEXT_MENU_TYPE.DRAG_SCHEDULE;
	}

	findDragScheduleContextMenuInfo(contextMenuInfo: ContextMenuInfo = this.contextMenuInfo): ContextMenuInfo {
		return contextMenuInfo && contextMenuInfo.type == Constants.CONTEXT_MENU_TYPE.DRAG_SCHEDULE
			? contextMenuInfo : undefined;
	}

	findDayMechanicSkills(
		day: Date,
		daysMechanicSkills: DaysMechanicSkills = this.daysMechanicSkills
	): DayMechanicSkills {
		return daysMechanicSkills[day.getTime()];
	}

	private checkTodayScheduleExists(today: Date = this.today): boolean {
		return this.mechanicsService.findDayMechanics(today) != undefined;
	}

	findLateralInfo(day: Date, daysLateralInfo: DaysLateralPanelInfo = this.daysLateralInfo): LateralPanelInfo {
		return daysLateralInfo[day.getTime()].info;
	}

	findDayAppointmentsCounterUpdate(day: Date): any {
		return this.daysAppointmentsCounterUpdate[day.getTime()];
	}

	calcTimeIndicatorLeft(time: Date = new Date()): number {
		return DimensionsService.calcLeftFromStart(time) + Constants.VALUE.MECHANIC_INFO_WIDTH;
	}

	findCursor(cursorName: string = this.cursor) {
		return UtilsService.isImage(cursorName)
			? this.sanitizer.bypassSecurityTrustStyle(`url(../../../assets/img/cursors/${cursorName}), auto`)
			: cursorName;
	}

	openContextMenu(event: PointerEvent): void {
		event.preventDefault();
		NotificationService.notifyContextMenu(
			new DragScheduleContextMenuInfo(new Coordinates(event.clientX, event.clientY))
		);
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
