import {Injectable} from '@angular/core';
import {UnassignedCardUpdate} from "../objects/update-cards/unassigned-card-update";
import {MechanicLineUpdate} from "../objects/update-days-cards/mechanic-line-update";
import {UnassignedCardUpdateTrigger} from "../objects/update-cards/unassigned-card-update-trigger";
import {MechanicUpdate} from "../objects/update-days-cards/mechanic-update";
import {Subject} from "rxjs/internal/Subject";
import {Observable} from "rxjs/internal/Observable";
import {AppointmentsCounterUpdate} from "../objects/update-appointments-counter/appointments-counter-update";
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {Coordinates} from "../objects/coordinates";
import {CardsGroup} from "../objects/cards-group";
import {Skill} from "../objects/skill";
import {DayMechanicSkills} from "../objects/skills-update/day-mechanic-skills";

@Injectable({
	providedIn: 'root'
})
export class NotificationService {

	private static mechanicLineSubject: Subject<MechanicUpdate>;
	private static _mechanicLine$: Observable<MechanicUpdate>;

	private static bandSubject: Subject<UnassignedCardUpdate>;
	private static _band$: Observable<UnassignedCardUpdate>;

	private static appointmentsCounterSubject: Subject<AppointmentsCounterUpdate>;
	private static _appointmentsCounter$: Observable<AppointmentsCounterUpdate>;

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

	private static skillsSubject: Subject<DayMechanicSkills>;
	private static _skills$: Observable<DayMechanicSkills>;

	// region Init

	static init(): void {
		this.mechanicLineSubject = new Subject<MechanicUpdate>();
		this.mechanicLine$ = this.mechanicLineSubject.asObservable();

		this.bandSubject = new Subject<UnassignedCardUpdate>();
		this.band$ = this.bandSubject.asObservable();

		this.appointmentsCounterSubject = new Subject<AppointmentsCounterUpdate>();
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

		this.skillsSubject = new Subject<DayMechanicSkills>();
		this.skills$ = this.skillsSubject.asObservable();
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

	static get appointmentsCounter$(): Observable<AppointmentsCounterUpdate> {
		return this._appointmentsCounter$;
	}

	static set appointmentsCounter$(value: Observable<AppointmentsCounterUpdate>) {
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

	static get skills$(): Observable<DayMechanicSkills> {
		return this._skills$;
	}

	static set skills$(value: Observable<DayMechanicSkills>) {
		this._skills$ = value;
	}

	// endregion

	static notifyAll(): void {
		NotificationService.notifyBand();
		NotificationService.notifyMechanicLine();
	}

	static notifyBand(cardUpdate: UnassignedCardUpdate = new UnassignedCardUpdateTrigger()): void {
		this.bandSubject.next(cardUpdate);
	}

	static notifyMechanicLine(day: Date = undefined, mechanicCode: string = undefined): void {
		this.mechanicLineSubject.next(new MechanicLineUpdate(day, mechanicCode));
	}

	static notifyAppointmentsCounter(update: AppointmentsCounterUpdate): void {
		this.appointmentsCounterSubject.next(update);
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

	static notifySkills(daySkills: DayMechanicSkills): void {
		this.skillsSubject.next(daySkills);
	}

}
