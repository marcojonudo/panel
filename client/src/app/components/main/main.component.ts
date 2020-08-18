import {
	ChangeDetectionStrategy, ChangeDetectorRef,
	Component, ElementRef,
	OnDestroy, OnInit, Renderer2,
} from '@angular/core';
import {Constants} from "../../objects/constants";
import {Subscription} from "rxjs/internal/Subscription";
import {CardsService} from "../../services/cards.service";
import {NotificationService} from "../../services/notification.service";
import {UtilsService} from "../../services/utils.service";
import {DimensionsService} from "../../services/dimensions.service";
import {MechanicsService} from "../../services/mechanics.service";
import {DaysAssignedGroups} from "../../objects/days-assigned-groups";
import {ContextMenuInfo} from "../../objects/context-menu/context-menu-info";
import {Mechanic} from "../../objects/mechanic";
import {interval} from "rxjs/internal/observable/interval";
import {Toast} from "../../objects/toasts/toast";
import {DomSanitizer} from "@angular/platform-browser";
import {DragScheduleContextMenuInfo} from "../../objects/context-menu/drag-schedule-context-menu-info";
import {Coordinates} from "../../objects/coordinates";
import {Dayjs} from "dayjs";
import * as dayjs from "dayjs";
import {HourQuarter} from "../../objects/hour-quarter";
import {MechanicSkillsUpdate} from "../../objects/trigger-cd/update-objects/mechanic-skills/mechanic-skills-update";
import {MechanicLineUpdate} from "../../objects/trigger-cd/update-objects/mechanic-line/mechanic-line-update";
import {DayTriggerMapUpdate} from "../../objects/trigger-cd/update-objects/trigger-map-update/day-trigger-map-update";
import { DaysTriggerMap } from 'src/app/objects/trigger-cd/trigger-maps/days-trigger-map';
import {LateralPanelInfo} from "../../objects/lateral-panel-info/lateral-panel-info";
import {AppointmentDayUpdate} from "../../objects/trigger-cd/update-objects/appointments-counter/appointment-day-update";
import {MechanicGroupUpdate} from "../../objects/trigger-cd/update-objects/groups/mechanic-group-update";
import {MaxScheduleWidthUpdate} from "../../objects/trigger-cd/update-objects/generic/max-schedule-width-update";
import {ContextMenuUpdate} from "../../objects/trigger-cd/update-objects/generic/context-menu-update";

@Component({
	selector: 'app-main',
	templateUrl: './main.component.html',
	styleUrls: ['./main.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent implements OnInit, OnDestroy {

	private _days: Dayjs[];
	private _today: Dayjs;
	private _dayContainerWidth: number;

	private _assignedDaysCardsGroups: DaysAssignedGroups;

	private daysTriggerMap: DaysTriggerMap;

	private _oneDayMode: boolean;
	private _maxScheduleHoursQuarter: HourQuarter[];
	private _maxScheduleWidth: number;
	private _maxScheduleMaxWidth: number;

	private _toast: Toast;

	private _cursor: string;

	private _contextMenuInfo: ContextMenuInfo;

	private _timeIndicatorLeft: number;
	private _initialScrollLeft: number;

	private relativeContainer: boolean;
	private scrollLeft: number;
	private scrollTop: number;

	private updateArraySubscription: Subscription;
	private oneDayModeSubscription: Subscription;
	private maxScheduleWidthSubscription: Subscription;
	private contextMenuSubscription: Subscription;
	private triggerCdSubscription: Subscription;
	private toastSubscription: Subscription;
	private mainCursorSubscription: Subscription;

	private appointmentsTypesContextMenuListener: () => void;
	private pointerDownListener: () => void;

	constructor(
		private cdRef: ChangeDetectorRef,
		private sanitizer: DomSanitizer,
		private element: ElementRef,
		private renderer: Renderer2
	) {
		this.days = MechanicsService.days;
		this.daysTriggerMap = new DaysTriggerMap(this.days);

		this.today = this.days[0];
		this.oneDayMode = DimensionsService.oneDayMode;
		this.maxScheduleHoursQuarter = DimensionsService.maxScheduleHoursQuarter;
		this.maxScheduleWidth = DimensionsService.maxScheduleWidth;
		this.maxScheduleMaxWidth = DimensionsService.maxScheduleMaxWidth;

		this.relativeContainer = true;
		this.scrollLeft = 0;
		this.scrollTop = 0;

		this.dayContainerWidth = window.innerWidth - Constants.VALUE.TOOLS_BAR_WIDTH;

		this.timeIndicatorLeft = MechanicsService.todaySchedules ? this.calcTimeIndicatorLeft() : undefined;
		this.cursor = Constants.MAIN_CURSOR.DEFAULT;
	}

	ngOnInit(): void {
		this.assignedDaysCardsGroups = CardsService.assignedDaysCardsGroups;

		this.updateArraySubscription = NotificationService.updateArray$
				.subscribe((updateArray: DayTriggerMapUpdate[]) => {
			updateArray.forEach((triggerMapUpdate: DayTriggerMapUpdate) => {
				triggerMapUpdate.updateTriggerMap(
					this.daysTriggerMap,
					triggerMapUpdate.day,
					triggerMapUpdate.type,
					triggerMapUpdate.value
				);
			});
			this.cdRef.detectChanges();
		});

		this.contextMenuSubscription = NotificationService.contextMenu$
				.subscribe((update: ContextMenuUpdate) => {
			this.contextMenuInfo = update.contextMenuInfo;
			if (this.contextMenuInfo) {
				this.pointerDownListener = this.renderer.listen(
					this.element.nativeElement,
					Constants.EVENT.POINTER_DOWN,
					this.onPointerDown.bind(this)
				);
			} else {
				this.pointerDownListener();
			}
			if (update.trigger) {
				this.cdRef.detectChanges();
			}
		});

		this.oneDayModeSubscription = NotificationService.oneDayMode$.subscribe((oneDayMode: boolean) => {
			this.oneDayMode = oneDayMode;
			this.maxScheduleHoursQuarter = DimensionsService.maxScheduleHoursQuarter;
			this.maxScheduleWidth = DimensionsService.maxScheduleWidth;
			this.maxScheduleMaxWidth = DimensionsService.maxScheduleMaxWidth;
		});

		this.maxScheduleWidthSubscription = NotificationService.maxScheduleWidth$
				.subscribe((update: MaxScheduleWidthUpdate) => {
			/* Se debe usar un observer distinto al anterior, en lugar de obtener el maxScheduleWidth directamente
			*  del valor retornado por calcMaxScheduleWidth, porque esa cifra también se puede calcular a partir
			*  del slider */
			this.maxScheduleWidth = update.maxScheduleWidth;
			this.timeIndicatorLeft = MechanicsService.todaySchedules ? this.calcTimeIndicatorLeft() : undefined;
			if (update.trigger) {
				this.cdRef.detectChanges();
			}
		});

		this.triggerCdSubscription = NotificationService.triggerCd$.subscribe(() => {
			this.cdRef.detectChanges();
		});

		this.toastSubscription = NotificationService.toast$.subscribe((toast: Toast) => {
			this.toast = toast;
			this.cdRef.detectChanges();
		});

		this.mainCursorSubscription = NotificationService.mainCursor$.subscribe((cursor: string) => {
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

		/* Sólo se define la barra del reloj si hay horarios hoy */
		if (MechanicsService.todaySchedules) {
			interval(Constants.VALUE.TIME_INDICATOR_INTERVAL).subscribe(() => {
				this.timeIndicatorLeft = this.calcTimeIndicatorLeft();
				this.cdRef.detectChanges();
			});
		}

		this.initialScrollLeft = MechanicsService.todaySchedules
			? this.calcTimeIndicatorLeft() - Constants.VALUE.MECHANIC_INFO_WIDTH * 2 : 0;
	}

	ngOnDestroy(): void {
		this.updateArraySubscription.unsubscribe();
		this.oneDayModeSubscription.unsubscribe();
		this.maxScheduleWidthSubscription.unsubscribe();
		this.triggerCdSubscription.unsubscribe();
		this.mainCursorSubscription.unsubscribe();
		this.toastSubscription.unsubscribe();
		this.contextMenuSubscription.unsubscribe();
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

	get todaySchedules(): boolean {
		return MechanicsService.todaySchedules;
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

	checkExistentSchedules(day: Dayjs = undefined): boolean {
		return (day ? MechanicsService.findDayMechanics(day).length : MechanicsService.days.length) != 0;
	}

	findDayMechanics(day: Dayjs): Mechanic[] {
		return MechanicsService.findDayMechanics(day);
	}

	findGroupsUpdate(
		day: Dayjs,
		daysTriggerMap: DaysTriggerMap = this.daysTriggerMap,
		type: string = Constants.UPDATE_OBJECT.GROUPS
	): MechanicGroupUpdate[] {
		return daysTriggerMap[day.valueOf()][type];
	}

	findDaySaturatedQuarters(
		day: Dayjs,
		daysTriggerMap: DaysTriggerMap = this.daysTriggerMap,
		type: string = Constants.UPDATE_OBJECT.SATURATED_QUARTERS
	): HourQuarter[] {
		return daysTriggerMap[day.valueOf()][type];
	}

	findDayMechanicSkillsUpdate(
		day: Dayjs,
		daysTriggerMap: DaysTriggerMap = this.daysTriggerMap,
		type: string = Constants.UPDATE_OBJECT.MECHANIC_SKILLS
	): MechanicSkillsUpdate {
		return daysTriggerMap[day.valueOf()][type];
	}

	findMechanicLineUpdates(
		day: Dayjs,
		daysTriggerMap: DaysTriggerMap = this.daysTriggerMap,
		type: string = Constants.UPDATE_OBJECT.MECHANIC_LINE
	): MechanicLineUpdate[] {
		return daysTriggerMap[day.valueOf()][type];
	}

	findLateralPanelInfo(
		day: Dayjs,
		daysTriggerMap: DaysTriggerMap = this.daysTriggerMap,
		type: string = Constants.UPDATE_OBJECT.LATERAL_PANEL
	): LateralPanelInfo {
		return daysTriggerMap[day.valueOf()][type];
	}

	findAppointmentDayUpdate(
		day: Dayjs,
		daysTriggerMap: DaysTriggerMap = this.daysTriggerMap,
		type: string = Constants.UPDATE_OBJECT.APPOINTMENT_DAY
	): AppointmentDayUpdate {
		return daysTriggerMap[day.valueOf()][type];
	}

	checkShowContextMenu(contextMenuInfo: ContextMenuInfo = this.contextMenuInfo): boolean {
		return contextMenuInfo != undefined;
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
			new DragScheduleContextMenuInfo(new Coordinates(event.clientX, event.clientY)),
			true
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
				CardsService.updateCardMode(CardsService.unassignedGroups, Constants.GROUP_MODE.DRAG);
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
