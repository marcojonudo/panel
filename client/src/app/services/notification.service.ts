import {Injectable} from '@angular/core';
import {Subject} from "rxjs/internal/Subject";
import {Observable} from "rxjs/internal/Observable";
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {Coordinates} from "../objects/coordinates";
import {CardsGroup} from "../objects/cards-group";
import {ContextMenuInfo} from "../objects/context-menu/context-menu-info";
import {Toast} from "../objects/toasts/toast";
import {Dayjs} from "dayjs";
import {Skill} from "../objects/skill";
import {HourQuarter} from "../objects/hour-quarter";
import {LateralPanelInfo} from "../objects/lateral-panel-info/lateral-panel-info";
import {DayAppointmentDayUpdate} from "../objects/trigger-cd/update-objects/appointments-counter/day-appointment-day-update";
import {DayLateralPanelUpdate} from "../objects/trigger-cd/update-objects/lateral-panel/day-lateral-panel-update";
import {DaySaturatedQuartersUpdate} from "../objects/trigger-cd/update-objects/saturated-quarteres/day-saturated-quarters-update";
import {DayMechanicSkillsUpdate} from "../objects/trigger-cd/update-objects/mechanic-skills/day-mechanic-skills-update";
import {MechanicSkills} from "../objects/mechanic-skills";
import {DayMechanicLineUpdate} from "../objects/trigger-cd/update-objects/mechanic-line/day-mechanic-line-update";
import {DayMechanicGroupUpdate} from "../objects/trigger-cd/update-objects/groups/day-mechanic-group-update";
import {Constants} from "../objects/constants";
import {TriggerMapUpdate} from "../objects/trigger-cd/update-objects/trigger-map-update/trigger-map-update";
import {DayTriggerMapUpdate} from "../objects/trigger-cd/update-objects/trigger-map-update/day-trigger-map-update";
import {MechanicLineUpdate} from "../objects/trigger-cd/update-objects/mechanic-line/mechanic-line-update";
import {MechanicGroupUpdate} from "../objects/trigger-cd/update-objects/groups/mechanic-group-update";
import {GroupUpdate} from "../objects/trigger-cd/update-objects/groups/group-update";
import {BandUpdate} from "../objects/trigger-cd/update-objects/band/band-update";
import {MaxScheduleWidthUpdate} from "../objects/trigger-cd/update-objects/generic/max-schedule-width-update";
import {CardsService} from "./cards.service";
import {ContextMenuUpdate} from "../objects/trigger-cd/update-objects/generic/context-menu-update";
import {DropzoneUpdate} from "../objects/trigger-cd/update-objects/mechanic-line/dropzone-update";
import {AppointmentDay} from "../objects/appointments/appointment-day";

@Injectable({
	providedIn: 'root'
})
export class NotificationService {

	private static _updateArray: DayTriggerMapUpdate[];

	private static updateArraySubject: Subject<any>;
	private static _updateArray$: Observable<any>;

	private static bandSubject: Subject<BandUpdate>;
	private static _band$: Observable<BandUpdate>;

	private static oneDayModeSubject: Subject<boolean>;
	private static _oneDayMode$: Observable<boolean>;

	private static maxScheduleWidthSubject: Subject<MaxScheduleWidthUpdate>;
	private static _maxScheduleWidth$: Observable<MaxScheduleWidthUpdate>;

	private static coordinatesSubject: Subject<Coordinates>;
	private static _coordinates$: Observable<Coordinates>;

	private static helperCardsGroupSubject: Subject<CardsGroup>;
	private static _helperCardsGroup$: Observable<CardsGroup>;

	private static draggingSubject: Subject<boolean>;
	private static _dragging$: Observable<boolean>;

	private static contextMenuSubject: Subject<ContextMenuUpdate>;
	private static _contextMenu$: Observable<ContextMenuUpdate>;

	private static triggerCdSubject: Subject<void>;
	private static _triggerCd$: Observable<void>;

	private static toastSubject: Subject<Toast>;
	private static _toast$: Observable<Toast>;

	private static mainCursorSubject: Subject<string>;
	private static _mainCursor$: Observable<string>;

	// region Init

	static init(): void {
		this.updateArray = [];

		this.updateArraySubject = new Subject<DayTriggerMapUpdate>();
		this.updateArray$ = this.updateArraySubject.asObservable();

		this.bandSubject = new Subject<BandUpdate>();
		this.band$ = this.bandSubject.asObservable();

		this.oneDayModeSubject = new Subject<boolean>();
		this.oneDayMode$ = this.oneDayModeSubject.asObservable();

		this.maxScheduleWidthSubject = new Subject<MaxScheduleWidthUpdate>();
		this.maxScheduleWidth$ = this.maxScheduleWidthSubject.asObservable();

		this.coordinatesSubject = new BehaviorSubject<Coordinates>(new Coordinates(0, 0));
		this.coordinates$ = this.coordinatesSubject.asObservable();

		this.helperCardsGroupSubject = new BehaviorSubject<CardsGroup>(undefined);
		this.helperCardsGroup$ = this.helperCardsGroupSubject.asObservable();

		this.draggingSubject = new BehaviorSubject<boolean>(false);
		this.dragging$ = this.draggingSubject.asObservable();

		this.contextMenuSubject = new Subject<ContextMenuUpdate>();
		this.contextMenu$ = this.contextMenuSubject.asObservable();

		this.triggerCdSubject = new Subject<void>();
		this.triggerCd$ = this.triggerCdSubject.asObservable();

		this.toastSubject = new Subject<Toast>();
		this.toast$ = this.toastSubject.asObservable();

		this.mainCursorSubject = new Subject<string>();
		this.mainCursor$ = this.mainCursorSubject.asObservable();
	}

	// endregion

	// region Getters / setters

	static get updateArray(): DayTriggerMapUpdate[] {
		return this._updateArray;
	}

	static set updateArray(value: DayTriggerMapUpdate[]) {
		this._updateArray = value;
	}

	static get band$(): Observable<BandUpdate> {
		return this._band$;
	}

	static set band$(value: Observable<BandUpdate>) {
		this._band$ = value;
	}

	static get oneDayMode$(): Observable<boolean> {
		return this._oneDayMode$;
	}

	static set oneDayMode$(value: Observable<boolean>) {
		this._oneDayMode$ = value;
	}

	static get maxScheduleWidth$(): Observable<MaxScheduleWidthUpdate> {
		return this._maxScheduleWidth$;
	}

	static set maxScheduleWidth$(value: Observable<MaxScheduleWidthUpdate>) {
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

	static get contextMenu$(): Observable<ContextMenuUpdate> {
		return this._contextMenu$;
	}

	static set contextMenu$(value: Observable<ContextMenuUpdate>) {
		this._contextMenu$ = value;
	}

	static get triggerCd$(): Observable<void> {
		return this._triggerCd$;
	}

	static set triggerCd$(value: Observable<void>) {
		this._triggerCd$ = value;
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

	static get updateArray$(): Observable<any> {
		return this._updateArray$;
	}

	static set updateArray$(value: Observable<any>) {
		this._updateArray$ = value;
	}

	// endregion

	static notifyUpdateArray(updateArray: any[] = this.updateArray): void {
		this.updateArraySubject.next(updateArray);
		this.clearUpdateArray();
	}

	static clearUpdateArray() {
		this.updateArray = [];
	}

	static notifyBand(section: string = undefined, groups: CardsGroup[] = undefined): void {
		const groupsUpdate = groups ? groups.map((group: CardsGroup) => new GroupUpdate(group.id, group)) : undefined;
		this.bandSubject.next(new BandUpdate(section, groupsUpdate));
	}

	static notifyMechanicLine(
		day: Dayjs = undefined,
		mechanicCode: string = undefined,
		notifyImmediately: boolean = true,
		triggerMapUpdate: TriggerMapUpdate = undefined,
		type: string = Constants.UPDATE_OBJECT.MECHANIC_LINE
	): void {
		const mechanicTriggerMapUpdate = new MechanicLineUpdate(mechanicCode, triggerMapUpdate)

		const existentDayMechanicLineUpdate = this.updateArray.find((dayTriggerMapUpdate: DayTriggerMapUpdate) =>
			dayTriggerMapUpdate.type == type && dayTriggerMapUpdate.day.isSame(day)
		);
		if (existentDayMechanicLineUpdate) {
			existentDayMechanicLineUpdate.value.push(mechanicTriggerMapUpdate);
		} else {
			this.updateArray.push(new DayMechanicLineUpdate(day, mechanicTriggerMapUpdate));
		}

		if (notifyImmediately) {
			this.notifyUpdateArray();
		}
	}

	static notifyAppointmentDay(day: Dayjs, appointmentDay: AppointmentDay): void {
		const dayAppointmentDayUpdate = new DayAppointmentDayUpdate(day, appointmentDay);
		this.updateArray.push(dayAppointmentDayUpdate);
	}

	static notifyOneDayMode(oneDayMode: boolean): void {
		this.oneDayModeSubject.next(oneDayMode);
	}

	static notifyMaxScheduleWidth(maxScheduleWidth: number): void {
		this.maxScheduleWidthSubject.next(new MaxScheduleWidthUpdate(maxScheduleWidth));

		/* Un cambio de maxScheduleWidth siempre implica tener que redimensionar elementos de la interfaz */
		NotificationService.notifyBand(undefined, CardsService.unassignedGroups)
		NotificationService.notifyGroups(CardsService.assignedGroups)
		NotificationService.notifyMechanicLine(
			undefined,
			undefined,
			true,
			new DropzoneUpdate()
		)
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
		const daySaturatedQuartersUpdate = new DaySaturatedQuartersUpdate(day, saturatedQuarters);
		this.updateArray.push(daySaturatedQuartersUpdate);
	}

	static notifyContextMenu(contextMenuInfo: ContextMenuInfo, trigger: boolean = false): void {
		this.contextMenuSubject.next(new ContextMenuUpdate(contextMenuInfo, trigger));
	}

	static notifyTriggerCd(): void {
		this.triggerCdSubject.next();
	}

	static notifyLateralInfo(day: Dayjs, lateralPanelInfo: LateralPanelInfo, notifyImmediately: boolean = false): void {
		const dayLateralPanelUpdate = new DayLateralPanelUpdate(day, lateralPanelInfo);
		this.updateArray.push(dayLateralPanelUpdate);

		if (notifyImmediately) {
			this.notifyUpdateArray();
		}
	}

	static notifyToast(toast: Toast): void {
		this.toastSubject.next(toast);
	}

	static notifyMainCursor(cursor: string): void {
		this.mainCursorSubject.next(cursor);
	}

	static notifyDayMechanicSkills(day: Dayjs, mechanicCode: string, skills: Skill[]): void {
		const dayMechanicSkillsUpdate = new DayMechanicSkillsUpdate(day, new MechanicSkills(mechanicCode, skills));
		this.updateArray.push(dayMechanicSkillsUpdate);
		this.notifyUpdateArray();
	}

	static notifyGroups(groups: CardsGroup[], notifyImmediately: boolean = false): void {
		const dayMechanicGroupUpdates = [];
		groups.forEach((group: CardsGroup) => {
			const dayMechanicGroupUpdate = dayMechanicGroupUpdates.find((dayUpdate: DayMechanicGroupUpdate) =>
				dayUpdate.day.isSame(group.day)
			);
			if (dayMechanicGroupUpdate) {
				const mechanicGroupUpdate = dayMechanicGroupUpdate.value
						.find((mechanicGroupUpdate: MechanicGroupUpdate) =>
					mechanicGroupUpdate.mechanicCode == group.mechanicCode
				);
				if (mechanicGroupUpdate) {
					mechanicGroupUpdate.value.push(new GroupUpdate(group.id, group));
				} else {
					dayMechanicGroupUpdate.value.push(
						new MechanicGroupUpdate(group.mechanicCode, new GroupUpdate(group.id, group))
					);
				}
			} else {
				const mechanicGroupUpdate = new MechanicGroupUpdate(group.mechanicCode, new GroupUpdate(group.id, group));
				dayMechanicGroupUpdates.push(new DayMechanicGroupUpdate(group.day, mechanicGroupUpdate));
			}
		});

		this.updateArray.push(...dayMechanicGroupUpdates);
		if (notifyImmediately) {
			this.notifyUpdateArray();
		}
	}

}
