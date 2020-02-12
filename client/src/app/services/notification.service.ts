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
import {DayQuartersSaturation} from "../objects/quarters-saturation-update/day-quarters-saturation";
import {ContextMenuInfo} from "../objects/context-menu-info";
import {DayLateralPanelInfo} from "../objects/lateral-panel-info/day-lateral-panel-info";
import {DayAppointmentsCounterUpdate} from "../objects/appointments-counter-update/day-appointments-counter-update";
import {Constants} from "../objects/constants";

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

	private static quartersSaturationSubject: Subject<DayQuartersSaturation>;
	private static _quartersSaturation$: Observable<DayQuartersSaturation>;

	private static contextMenuSubject: Subject<ContextMenuInfo>;
	private static _contextMenu$: Observable<ContextMenuInfo>;

	private static onlyAppointmentsModeSubject: Subject<void>;
	private static _onlyAppointmentsMode$: Observable<void>;

	private static lateralInfoSubject: Subject<DayLateralPanelInfo>;
	private static _lateralInfo$: Observable<DayLateralPanelInfo>;

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

		this.quartersSaturationSubject = new Subject<DayQuartersSaturation>();
		this.quartersSaturation$ = this.quartersSaturationSubject.asObservable();

		this.contextMenuSubject = new Subject<ContextMenuInfo>();
		this.contextMenu$ = this.contextMenuSubject.asObservable();

		this.onlyAppointmentsModeSubject = new Subject<void>();
		this.onlyAppointmentsMode$ = this.onlyAppointmentsModeSubject.asObservable();

		this.lateralInfoSubject = new Subject<DayLateralPanelInfo>();
		this.lateralInfo$ = this.lateralInfoSubject.asObservable();
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

	static get quartersSaturation$(): Observable<DayQuartersSaturation> {
		return this._quartersSaturation$;
	}

	static set quartersSaturation$(value: Observable<DayQuartersSaturation>) {
		this._quartersSaturation$ = value;
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

	static get lateralInfo$(): Observable<DayLateralPanelInfo> {
		return this._lateralInfo$;
	}

	static set lateralInfo$(value: Observable<DayLateralPanelInfo>) {
		this._lateralInfo$ = value;
	}

	// endregion

	static notifyAll(): void {
		NotificationService.notifyBand();
		NotificationService.notifyMechanicLine(Constants.MECHANIC_LINE_UPDATE_TYPE.MAX_SCHEDULE_WIDTH);
	}

	static notifyBand(cardUpdate: UnassignedCardUpdate = new UnassignedCardUpdateTrigger()): void {
		this.bandSubject.next(cardUpdate);
	}

	static notifyMechanicLine(type: string = undefined, day: Date = undefined, mechanicCode: string = undefined): void {
		this.mechanicLineSubject.next(new MechanicLineUpdate(type, day, mechanicCode));
	}

	static notifyAppointmentsCounter(dayAppointmentsCounters: DayAppointmentsCounterUpdate): void {
		this.appointmentsCounterSubject.next(dayAppointmentsCounters);
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

	static notifyQuartersSaturation(dayQuartersSaturation: DayQuartersSaturation): void {
		this.quartersSaturationSubject.next(dayQuartersSaturation);
	}

	static notifyContextMenu(contextMenuInfo: ContextMenuInfo): void {
		this.contextMenuSubject.next(contextMenuInfo);
	}

	static notifyOnlyAppointmentsMode(): void {
		this.onlyAppointmentsModeSubject.next();
	}

	static notifyLateralInfo(dayLateralInfo: DayLateralPanelInfo): void {
		this.lateralInfoSubject.next(dayLateralInfo)
	}

}
