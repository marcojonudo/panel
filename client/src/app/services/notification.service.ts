import {Injectable} from '@angular/core';
import {UnassignedCardUpdate} from "../objects/update-cards/unassigned-card-update";
import {MechanicLineUpdateTrigger} from "../objects/update-days-cards/mechanic-line-update-trigger";
import {UnassignedCardUpdateTrigger} from "../objects/update-cards/unassigned-card-update-trigger";
import {MechanicLineUpdate} from "../objects/update-days-cards/mechanic-line-update";
import {Subject} from "rxjs/internal/Subject";
import {Observable} from "rxjs/internal/Observable";
import {AppointmentsCounterUpdate} from "../objects/update-appointments-counter/appointments-counter-update";

@Injectable({
	providedIn: 'root'
})
export class NotificationService {

	private static mechanicLineSubject: Subject<MechanicLineUpdate>;
	private static _mechanicLine$: Observable<MechanicLineUpdate>;

	private static bandSubject: Subject<UnassignedCardUpdate>;
	private static _band$: Observable<UnassignedCardUpdate>;

	private static appointmentsCounterSubject: Subject<AppointmentsCounterUpdate>;
	private static _appointmentsCounter$: Observable<AppointmentsCounterUpdate>;

	// region Init

	static init(): void {
		this.mechanicLineSubject = new Subject<MechanicLineUpdate>();
		this.mechanicLine$ = this.mechanicLineSubject.asObservable();

		this.bandSubject = new Subject<UnassignedCardUpdate>();
		this.band$ = this.bandSubject.asObservable();

		this.appointmentsCounterSubject = new Subject<AppointmentsCounterUpdate>();
		this.appointmentsCounter$ = this.appointmentsCounterSubject.asObservable();
	}

	// endregion

	// region Getters / setters

	static get mechanicLine$(): Observable<MechanicLineUpdate> {
		return this._mechanicLine$;
	}

	static set mechanicLine$(value: Observable<MechanicLineUpdate>) {
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

	// endregion

	static notifyAll(): void {
		NotificationService.notifyBand();
		NotificationService.notifyMechanicLine();
	}

	static notifyBand(cardUpdate: UnassignedCardUpdate = new UnassignedCardUpdateTrigger()): void {
		this.bandSubject.next(cardUpdate);
	}

	static notifyMechanicLine(day: Date = undefined, mechanicCode: string = undefined): void {
		this.mechanicLineSubject.next(new MechanicLineUpdateTrigger(day, mechanicCode));
	}

	static notifyAppointmentsCounter(update: AppointmentsCounterUpdate): void {
		this.appointmentsCounterSubject.next(update);
	}

}
