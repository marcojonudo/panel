import {Injectable} from '@angular/core';
import {UnassignedCardUpdate} from "../objects/update-cards/unassigned-card-update";
import {MechanicLineUpdate} from "../objects/update-days-cards/mechanic-line-update";
import {UnassignedCardUpdateTrigger} from "../objects/update-cards/unassigned-card-update-trigger";
import {MechanicUpdate} from "../objects/update-days-cards/mechanic-update";
import {Subject} from "rxjs/internal/Subject";
import {Observable} from "rxjs/internal/Observable";
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {Coordinates} from "../objects/coordinates";
import {CardsGroup} from "../objects/cards-group";
import {DaySaturatedQuarters} from "../objects/quarters-saturation-update/day-saturated-quarters";
import {ContextMenuInfo} from "../objects/context-menu/context-menu-info";
import {DayAppointmentsCounter} from "../objects/appointments-counter-update/day-appointments-counter";
import {Constants} from "../objects/constants";
import {Toast} from "../objects/toasts/toast";
import {Dayjs} from "dayjs";
import {DayMechanicSkills} from "../objects/skills-update/day-mechanic-skills";
import {Skill} from "../objects/skill";
import {HourQuarter} from "../objects/hour-quarter";
import {DayMechanicSkillsUpdate} from "../objects/trigger-cd/update-objects/day-mechanic-skills-update";
import {DaySaturatedQuartersUpdate} from "../objects/trigger-cd/update-objects/day-saturated-quarters-update";
import {DayLateralPanelUpdate} from "../objects/trigger-cd/update-objects/day-lateral-panel-update";
import {LateralPanelInfo} from "../objects/lateral-panel-info/lateral-panel-info";
import {DayLateralPanelInfo} from "../objects/lateral-panel-info/day-lateral-panel-info";
import {AppointmentsCounter} from "../objects/appointments-counter";
import {DayAppointmentsCounterUpdate} from "../objects/trigger-cd/update-objects/day-appointments-counter-update";

@Injectable({
	providedIn: 'root'
})
export class NotificationService {

	private static mechanicLineSubject: Subject<MechanicUpdate>;
	private static _mechanicLine$: Observable<MechanicUpdate>;

	private static bandSubject: Subject<UnassignedCardUpdate>;
	private static _band$: Observable<UnassignedCardUpdate>;

	private static appointmentsCounterSubject: Subject<DayAppointmentsCounterUpdate>;
	private static _appointmentsCounter$: Observable<DayAppointmentsCounterUpdate>;

	private static oneDayModeSubject: Subject<boolean>;
	private static _oneDayMode$: Observable<boolean>;

	private static maxScheduleWidthSubject: Subject<number>;
	private static _maxScheduleWidth$: Observable<number>;

	private static coordinatesSubject: Subject<Coordinates>;
	private static _coordinates$: Observable<Coordinates>;

	private static helperCardsGroupSubject: Subject<CardsGroup>;
	private static _helperCardsGroup$: Observable<CardsGroup>;

	private static draggingSubject: Subject<boolean>;
	private static _dragging$: Observable<boolean>;

	private static saturatedQuartersSubject: Subject<DaySaturatedQuartersUpdate>;
	private static _saturatedQuarters$: Observable<DaySaturatedQuartersUpdate>;

	private static contextMenuSubject: Subject<ContextMenuInfo>;
	private static _contextMenu$: Observable<ContextMenuInfo>;

	private static onlyAppointmentsModeSubject: Subject<void>;
	private static _onlyAppointmentsMode$: Observable<void>;

	private static lateralInfoSubject: Subject<DayLateralPanelUpdate>;
	private static _lateralInfo$: Observable<DayLateralPanelUpdate>;

	private static toastSubject: Subject<Toast>;
	private static _toast$: Observable<Toast>;

	private static mainCursorSubject: Subject<string>;
	private static _mainCursor$: Observable<string>;

	private static dayMechanicSkillsSubject: Subject<DayMechanicSkillsUpdate>;
	private static _dayMechanicSkills$: Observable<DayMechanicSkillsUpdate>;

	// region Init

	static init(): void {
		this.mechanicLineSubject = new Subject<MechanicUpdate>();
		this.mechanicLine$ = this.mechanicLineSubject.asObservable();

		this.bandSubject = new Subject<UnassignedCardUpdate>();
		this.band$ = this.bandSubject.asObservable();

		this.appointmentsCounterSubject = new Subject<DayAppointmentsCounterUpdate>();
		this.appointmentsCounter$ = this.appointmentsCounterSubject.asObservable();

		this.oneDayModeSubject = new Subject<boolean>();
		this.oneDayMode$ = this.oneDayModeSubject.asObservable();

		this.maxScheduleWidthSubject = new Subject<number>();
		this.maxScheduleWidth$ = this.maxScheduleWidthSubject.asObservable();

		this.coordinatesSubject = new BehaviorSubject<Coordinates>(new Coordinates(0, 0));
		this.coordinates$ = this.coordinatesSubject.asObservable();

		this.helperCardsGroupSubject = new BehaviorSubject<CardsGroup>(undefined);
		this.helperCardsGroup$ = this.helperCardsGroupSubject.asObservable();

		this.draggingSubject = new BehaviorSubject<boolean>(false);
		this.dragging$ = this.draggingSubject.asObservable();

		this.saturatedQuartersSubject = new Subject<DaySaturatedQuartersUpdate>();
		this.saturatedQuarters$ = this.saturatedQuartersSubject.asObservable();

		this.contextMenuSubject = new Subject<ContextMenuInfo>();
		this.contextMenu$ = this.contextMenuSubject.asObservable();

		this.onlyAppointmentsModeSubject = new Subject<void>();
		this.onlyAppointmentsMode$ = this.onlyAppointmentsModeSubject.asObservable();

		this.lateralInfoSubject = new Subject<DayLateralPanelUpdate>();
		this.lateralInfo$ = this.lateralInfoSubject.asObservable();

		this.toastSubject = new Subject<Toast>();
		this.toast$ = this.toastSubject.asObservable();

		this.mainCursorSubject = new Subject<string>();
		this.mainCursor$ = this.mainCursorSubject.asObservable();

		this.dayMechanicSkillsSubject = new Subject<DayMechanicSkillsUpdate>();
		this.dayMechanicSkills$ = this.dayMechanicSkillsSubject.asObservable();
	}

	// endregion

	// region Getters / setters

	static get mechanicLine$(): Observable<MechanicUpdate> {
		return this._mechanicLine$;
	}

	static set mechanicLine$(value: Observable<MechanicUpdate>) {
		this._mechanicLine$ = value;
	}

	static get band$(): Observable<UnassignedCardUpdate> {
		return this._band$;
	}

	static set band$(value: Observable<UnassignedCardUpdate>) {
		this._band$ = value;
	}

	static get appointmentsCounter$(): Observable<DayAppointmentsCounterUpdate> {
		return this._appointmentsCounter$;
	}

	static set appointmentsCounter$(value: Observable<DayAppointmentsCounterUpdate>) {
		this._appointmentsCounter$ = value;
	}

	static get oneDayMode$(): Observable<boolean> {
		return this._oneDayMode$;
	}

	static set oneDayMode$(value: Observable<boolean>) {
		this._oneDayMode$ = value;
	}

	static get maxScheduleWidth$(): Observable<number> {
		return this._maxScheduleWidth$;
	}

	static set maxScheduleWidth$(value: Observable<number>) {
		this._maxScheduleWidth$ = value;
	}

	static get dragging$(): Observable<boolean> {
		return this._dragging$;
	}

	static set dragging$(value: Observable<boolean>) {
		this._dragging$ = value;
	}

	static get helperCardsGroup$(): Observable<CardsGroup> {
		return this._helperCardsGroup$;
	}

	static set helperCardsGroup$(value: Observable<CardsGroup>) {
		this._helperCardsGroup$ = value;
	}

	static get coordinates$(): Observable<Coordinates> {
		return this._coordinates$;
	}

	static set coordinates$(value: Observable<Coordinates>) {
		this._coordinates$ = value;
	}

	static get saturatedQuarters$(): Observable<DaySaturatedQuartersUpdate> {
		return this._saturatedQuarters$;
	}

	static set saturatedQuarters$(value: Observable<DaySaturatedQuartersUpdate>) {
		this._saturatedQuarters$ = value;
	}

	static get contextMenu$(): Observable<ContextMenuInfo> {
		return this._contextMenu$;
	}

	static set contextMenu$(value: Observable<ContextMenuInfo>) {
		this._contextMenu$ = value;
	}

	static get onlyAppointmentsMode$(): Observable<void> {
		return this._onlyAppointmentsMode$;
	}

	static set onlyAppointmentsMode$(value: Observable<void>) {
		this._onlyAppointmentsMode$ = value;
	}

	static get lateralInfo$(): Observable<DayLateralPanelUpdate> {
		return this._lateralInfo$;
	}

	static set lateralInfo$(value: Observable<DayLateralPanelUpdate>) {
		this._lateralInfo$ = value;
	}

	static get toast$(): Observable<Toast> {
		return this._toast$;
	}

	static set toast$(value: Observable<Toast>) {
		this._toast$ = value;
	}

	static get mainCursor$(): Observable<string> {
		return this._mainCursor$;
	}

	static set mainCursor$(value: Observable<string>) {
		this._mainCursor$ = value;
	}

	static get dayMechanicSkills$(): Observable<DayMechanicSkillsUpdate> {
		return this._dayMechanicSkills$;
	}

	static set dayMechanicSkills$(value: Observable<DayMechanicSkillsUpdate>) {
		this._dayMechanicSkills$ = value;
	}

	// endregion

	static notifyAll(): void {
		NotificationService.notifyBand();
		NotificationService.notifyMechanicLine(Constants.MECHANIC_LINE_UPDATE_TYPE.MAX_SCHEDULE_WIDTH);
	}

	static notifyBand(cardUpdate: UnassignedCardUpdate = new UnassignedCardUpdateTrigger()): void {
		this.bandSubject.next(cardUpdate);
	}

	static notifyMechanicLine(type: string = undefined, day: Dayjs = undefined, mechanicCode: string = undefined): void {
		this.mechanicLineSubject.next(new MechanicLineUpdate(type, day, mechanicCode));
	}

	static notifyAppointmentsCounter(day: Dayjs, appointmentsCounter: AppointmentsCounter): void {
		const dayAppointmentsCounterUpdate = new DayAppointmentsCounterUpdate(
			new DayAppointmentsCounter(day, appointmentsCounter)
		);
		this.appointmentsCounterSubject.next(dayAppointmentsCounterUpdate);
	}

	static notifyOneDayMode(oneDayMode: boolean): void {
		this.oneDayModeSubject.next(oneDayMode);
	}

	static notifyMaxScheduleWidth(maxScheduleWidth: number): void {
		this.maxScheduleWidthSubject.next(maxScheduleWidth);
	}

	static notifyCoordinates(coordinates: Coordinates): void {
		this.coordinatesSubject.next(coordinates);
	}

	static notifyHelperGroup(group: CardsGroup): void {
		this.helperCardsGroupSubject.next(group);
	}

	static notifyDragging(dragging: boolean): void {
		this.draggingSubject.next(dragging);
	}

	static notifySaturatedQuarters(day: Dayjs, saturatedQuarters: HourQuarter[]): void {
		const daySaturatedQuartersUpdate = new DaySaturatedQuartersUpdate(new DaySaturatedQuarters(day, saturatedQuarters));
		this.saturatedQuartersSubject.next(daySaturatedQuartersUpdate);
	}

	static notifyContextMenu(contextMenuInfo: ContextMenuInfo): void {
		this.contextMenuSubject.next(contextMenuInfo);
	}

	static notifyOnlyAppointmentsMode(): void {
		this.onlyAppointmentsModeSubject.next();
	}

	static notifyLateralInfo(day: Dayjs, lateralPanelInfo: LateralPanelInfo): void {
		const dayLateralPanelUpdate = new DayLateralPanelUpdate(new DayLateralPanelInfo(day, lateralPanelInfo));
		this.lateralInfoSubject.next(dayLateralPanelUpdate)
	}

	static notifyToast(toast: Toast): void {
		this.toastSubject.next(toast);
	}

	static notifyMainCursor(cursor: string): void {
		this.mainCursorSubject.next(cursor);
	}

	static notifyDayMechanicSkills(day: Dayjs, mechanicCode: string, skills: Skill[]): void {
		const dayMechanicSkillsUpdate = new DayMechanicSkillsUpdate(new DayMechanicSkills(day, mechanicCode, skills));
		this.dayMechanicSkillsSubject.next(dayMechanicSkillsUpdate);
	}

}
