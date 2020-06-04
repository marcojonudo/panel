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
import {ContextMenuInfo} from "../../objects/context-menu/context-menu-info";
import {Mechanic} from "../../objects/mechanic";
import {interval} from "rxjs/internal/observable/interval";
import {LateralPanelInfo} from "../../objects/lateral-panel-info/lateral-panel-info";
import {AppointmentsService} from "../../services/appointments.service";
import {MechanicLineUpdate} from "../../objects/update-days-cards/mechanic-line-update";
import {Toast} from "../../objects/toasts/toast";
import {DomSanitizer} from "@angular/platform-browser";
import {DragScheduleContextMenuInfo} from "../../objects/context-menu/drag-schedule-context-menu-info";
import {Coordinates} from "../../objects/coordinates";
import {Dayjs} from "dayjs";
import * as dayjs from "dayjs";
import {HourQuarter} from "../../objects/hour-quarter";
import {DaysUpdateObjects} from "../../objects/trigger-cd/days-update-objects";
import {MechanicSkillsUpdate} from "../../objects/trigger-cd/update-objects/mechanic-skills-update";
import {MechanicSkills} from "../../objects/mechanic-skills";
import {DayLateralPanelUpdate} from "../../objects/trigger-cd/update-objects/day-lateral-panel-update";
import {DayMechanicSkillsUpdate} from "../../objects/trigger-cd/update-objects/day-mechanic-skills-update";
import {DaySaturatedQuartersUpdate} from "../../objects/trigger-cd/update-objects/day-saturated-quarters-update";
import {DayAppointmentsCounterUpdate} from "../../objects/trigger-cd/update-objects/day-appointments-counter-update";
import {AppointmentsCounterUpdate} from "../../objects/trigger-cd/update-objects/appointments-counter-update";

@Component({
	selector: 'app-main',
	templateUrl: './main.component.html',
	styleUrls: ['./main.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent implements OnInit, OnDestroy {

	private _days: Dayjs[];
	private _today: Dayjs;
	private itemSize: number;
	private _existentTodaySchedules: boolean;
	private _dayContainerWidth: number;

	private _assignedDaysCardsGroups: DaysAssignedGroups;

	private daysUpdateObjects: DaysUpdateObjects;

	private _oneDayMode: boolean;
	private _maxScheduleHoursQuarter: HourQuarter[];
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
	private dayMechanicSkillsSubscription: Subscription;

	private appointmentsTypesContextMenuListener: () => void;
	private pointerDownListener: () => void;

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
		this.days = MechanicsService.days;
		this.initDaysUpdateObjects();

		this.today = dayjs().startOf(Constants.DAY_JS.d);
		this.oneDayMode = true;
		this.maxScheduleHoursQuarter = DimensionsService.maxScheduleHoursQuarter;
		this.maxScheduleWidth = DimensionsService.maxScheduleWidth;
		this.maxScheduleMaxWidth = DimensionsService.maxScheduleMaxWidth;
		// this.itemSize = MechanicsService.mechanics.length * (Constants.VALUE.LINE_HEIGHT_DEFAULT + 10);

		this.relativeContainer = true;
		this.scrollLeft = 0;
		this.scrollTop = 0;

		this.existentTodaySchedules = this.checkDaySchedulesExist();
		this.dayContainerWidth = window.innerWidth - Constants.VALUE.TOOLS_BAR_WIDTH;

		this.timeIndicatorLeft = this.existentTodaySchedules ? this.calcTimeIndicatorLeft() : undefined;
		this.cursor = Constants.MAIN_CURSOR.DEFAULT;
	}

	ngOnInit(): void {
		this.assignedDaysCardsGroups = CardsService.assignedDaysCardsGroups;
		this.mechanicLineSubscription = NotificationService.mechanicLine$
				.subscribe((mechanicLineUpdate: MechanicUpdate) => {
			this.mechanicLineUpdate = mechanicLineUpdate;
			this.cdRef.detectChanges();
		});

		this.quartersSaturationSubscription = NotificationService.saturatedQuarters$
				.subscribe((daySaturatedQuartersUpdate: DaySaturatedQuartersUpdate) => {
			daySaturatedQuartersUpdate.updateObjects(this.daysUpdateObjects);
			this.cdRef.detectChanges();
		});

		this.contextMenuSubscription = NotificationService.contextMenu$
				.subscribe((contextMenuInfo: ContextMenuInfo) => {
			this.contextMenuInfo = contextMenuInfo;
			if (this.contextMenuInfo) {
				this.pointerDownListener = this.renderer.listen(
					this.element.nativeElement,
					Constants.EVENT.POINTER_DOWN,
					this.onPointerDown.bind(this)
				);
			} else {
				this.pointerDownListener();
			}
			this.cdRef.detectChanges();
		});

		this.oneDayModeSubscription = NotificationService.oneDayMode$.subscribe((oneDayMode: boolean) => {
			this.oneDayMode = oneDayMode;
			DimensionsService.updateMaxSchedule(this.oneDayMode, this.today);
			this.maxScheduleHoursQuarter = DimensionsService.maxScheduleHoursQuarter;
			this.maxScheduleWidth = DimensionsService.maxScheduleWidth;
			this.maxScheduleMaxWidth = DimensionsService.maxScheduleMaxWidth;
			CardPositionService.updateDimensions(
				CardsService.unassignedSections,
				CardsService.assignedDaysCardsGroups
			);
			this.existentTodaySchedules = this.oneDayMode && this.checkDaySchedulesExist();
			this.mechanicLineUpdate = new MechanicLineUpdate(Constants.MECHANIC_LINE_UPDATE_TYPE.MAX_SCHEDULE_WIDTH);
			this.cdRef.detectChanges();
		});
		this.maxScheduleWidthSubscription = NotificationService.maxScheduleWidth$.subscribe(maxScheduleWidth => {
			/* Se debe usar un observer distinto al anterior, en lugar de obtener el maxScheduleWidth directamente
			*  del valor retornado por calcMaxScheduleWidth, porque esa cifra también se puede calcular a partir
			*  del slider */
			this.maxScheduleWidth = maxScheduleWidth;
			CardPositionService.updateDimensions(
				CardsService.unassignedSections,
				CardsService.assignedDaysCardsGroups
			);
			this.timeIndicatorLeft = this.existentTodaySchedules ? this.calcTimeIndicatorLeft() : undefined;
			NotificationService.notifyAll();
			this.cdRef.detectChanges();
		});

		this.lateralInfoSubscription = NotificationService.lateralInfo$
				.subscribe((dayLateralPanelUpdate: DayLateralPanelUpdate) => {
			dayLateralPanelUpdate.updateObjects(this.daysUpdateObjects);
			this.cdRef.detectChanges();
		});

		this.dayMechanicSkillsSubscription = NotificationService.dayMechanicSkills$
				.subscribe((dayMechanicSkillsUpdate: DayMechanicSkillsUpdate) => {
			dayMechanicSkillsUpdate.updateObjects(this.daysUpdateObjects);
			this.cdRef.detectChanges();
		});

		this.onlyAppointmentsModeSubscription = NotificationService.onlyAppointmentsMode$.subscribe(() => {
			this.cdRef.detectChanges();
		});

		this.appointmentsCounterSubscription = NotificationService.appointmentsCounter$
				.subscribe((dayAppointmentsCounterUpdate: DayAppointmentsCounterUpdate) => {
			dayAppointmentsCounterUpdate.updateObjects(this.daysUpdateObjects);
			// TODO Se debe ejecutar al modificar el total de citas. No al mover fichas
			this.cdRef.detectChanges();
		});

		this.toastSubscription = NotificationService.toast$.subscribe((toast: Toast) => {
			this.toast = toast;
			this.cdRef.detectChanges();
		});

		this.dragSchedulesSubscription = NotificationService.mainCursor$.subscribe((cursor: string) => {
			this.cursor = cursor;

			if (this.cursor == Constants.MAIN_CURSOR.DRAGGING_SCHEDULES) {
				this.appointmentsTypesContextMenuListener = this.renderer.listen(
					this.element.nativeElement,
					Constants.EVENT.CONTEXT_MENU,
					this.openContextMenu.bind(this)
				);
			} else {
				this.appointmentsTypesContextMenuListener();
			}
			this.cdRef.detectChanges();
		});

		interval(Constants.VALUE.TIME_INDICATOR_INTERVAL).subscribe(() => {
			this.timeIndicatorLeft = this.existentTodaySchedules ? this.calcTimeIndicatorLeft() : undefined;
			this.cdRef.detectChanges();
		});

		this.initialScrollLeft = this.existentTodaySchedules
			? this.calcTimeIndicatorLeft() - Constants.VALUE.MECHANIC_INFO_WIDTH * 2 : 0;
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

	get days(): Dayjs[] {
		return this._days;
	}

	set days(value: Dayjs[]) {
		this._days = value;
	}

	get today(): Dayjs {
		return this._today;
	}

	set today(value: Dayjs) {
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

	get existentTodaySchedules(): boolean {
		return this._existentTodaySchedules;
	}

	set existentTodaySchedules(value: boolean) {
		this._existentTodaySchedules = value;
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

	get maxScheduleHoursQuarter(): HourQuarter[] {
		return this._maxScheduleHoursQuarter;
	}

	set maxScheduleHoursQuarter(value: HourQuarter[]) {
		this._maxScheduleHoursQuarter = value;
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

	private initDaysUpdateObjects(days: Dayjs[] = this.days): void {
		this.daysUpdateObjects = {};
		if (days.length) {
			days.forEach((day: Dayjs) => {
				const dayUpdateObjects = {}
				dayUpdateObjects[Constants.TRIGGER_CD_UPDATE_PROPERTY.SATURATED_QUARTERS] =
					CardsService.buildDaySaturation(day);
				dayUpdateObjects[Constants.TRIGGER_CD_UPDATE_PROPERTY.MECHANIC_SKILLS] =
					new MechanicSkillsUpdate(new MechanicSkills());
				dayUpdateObjects[Constants.TRIGGER_CD_UPDATE_PROPERTY.LATERAL_PANEL] = undefined;
				dayUpdateObjects[Constants.TRIGGER_CD_UPDATE_PROPERTY.APPOINTMENTS_COUNTER] =
					new AppointmentsCounterUpdate(this.appointmentsService.findDayAppointmentsCounter(day));

				this.daysUpdateObjects[day.valueOf()] = dayUpdateObjects;
			});
		}
	}

	findDayMechanics(day: Dayjs): Mechanic[] {
		return MechanicsService.findDayMechanics(day);
	}

	checkTriggerLineCd(day: Dayjs, mechanicLineUpdate: MechanicUpdate = this.mechanicLineUpdate): MechanicUpdate {
		let update = undefined;
		if (mechanicLineUpdate) {
			update = !mechanicLineUpdate.day || day.isSame(mechanicLineUpdate.day)
				? mechanicLineUpdate : undefined;
		}
		return update;
	}

	findSaturatedQuarters(
		day: Dayjs,
		daysUpdateObjects: DaysUpdateObjects = this.daysUpdateObjects,
		type: string = Constants.TRIGGER_CD_UPDATE_PROPERTY.SATURATED_QUARTERS
	): HourQuarter[] {
		return daysUpdateObjects[day.valueOf()][type];
	}

	checkShowContextMenu(contextMenuInfo: ContextMenuInfo = this.contextMenuInfo): boolean {
		return contextMenuInfo != undefined;
	}

	findMechanicSkills(
		day: Dayjs,
		daysUpdateObjects: DaysUpdateObjects = this.daysUpdateObjects,
		type: string = Constants.TRIGGER_CD_UPDATE_PROPERTY.MECHANIC_SKILLS
	): MechanicSkillsUpdate {
		return daysUpdateObjects[day.valueOf()][type];
	}

	private checkDaySchedulesExist(day: Dayjs = this.today): boolean {
		const mechanics = MechanicsService.findDayMechanics(day, false);
		return mechanics != undefined && mechanics.length != 0;
	}

	findLateralInfo(
		day: Dayjs,
		daysUpdateObjects: DaysUpdateObjects = this.daysUpdateObjects,
		type: string = Constants.TRIGGER_CD_UPDATE_PROPERTY.LATERAL_PANEL
	): LateralPanelInfo {
		return daysUpdateObjects[day.valueOf()][type];
	}

	findAppointmentsCounter(
		day: Dayjs,
		daysUpdateObjects: DaysUpdateObjects = this.daysUpdateObjects,
		type: string = Constants.TRIGGER_CD_UPDATE_PROPERTY.APPOINTMENTS_COUNTER
	): AppointmentsCounterUpdate {
		return daysUpdateObjects[day.valueOf()][type];
	}

	calcTimeIndicatorLeft(time: Dayjs = dayjs()): number {
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

	onPointerDown(event: PointerEvent): void {
		if (UtilsService.checkLeftClick(event)) {
			/* Si se hace clic en el menú contextual, este no se cierra (al menos desde aquí). Puede ser necesario que
			*  no lo haga directamente, y requerir alguna interacción del usuario, por lo que se gestiona qué hacer con
			*  él desde el click handler de la opción correspondiente */
			if (this.contextMenuInfo && !this.checkElementId(<HTMLElement> event.target, Constants.CONTEXT_MENU)) {
				this.contextMenuInfo.handleRemoval();
			}
			if (CardsService.auxiliaryGroupToReplace) {
				CardsService.updateCardMode(CardsService.unassignedCardsGroups, Constants.GROUP_MODE.DRAG);
			}
		}
	}

	checkElementId(element: HTMLElement, idSubstring: string, level: number = 0): boolean {
		if (element.id.includes(idSubstring)) {
			return true;
		}
		if (level < 3) {
			return this.checkElementId(<HTMLElement> element.parentNode, idSubstring, ++level);
		}
		return false;
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
