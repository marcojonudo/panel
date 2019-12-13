import {Injectable} from '@angular/core';
import {UnassignedCardUpdate} from "../objects/update-cards/unassigned-card-update";
import {MechanicLineUpdateTrigger} from "../objects/update-days-cards/mechanic-line-update-trigger";
import {UnassignedCardUpdateTrigger} from "../objects/update-cards/unassigned-card-update-trigger";
import {MechanicLineUpdate} from "../objects/update-days-cards/mechanic-line-update";
import {Subject} from "rxjs/internal/Subject";
import {Observable} from "rxjs/internal/Observable";

@Injectable({
	providedIn: 'root'
})
export class NotificationService {

	private static mechanicLineSubject: Subject<MechanicLineUpdate>;
	private static _mechanicLine$: Observable<MechanicLineUpdate>;

	private static barSubject: Subject<UnassignedCardUpdate>;
	private static _bar$: Observable<UnassignedCardUpdate>;

	// region Init

	static init(): void {
		this.mechanicLineSubject = new Subject<MechanicLineUpdate>();
		this.mechanicLine$ = this.mechanicLineSubject.asObservable();

		this.barSubject = new Subject<UnassignedCardUpdate>();
		this.bar$ = this.barSubject.asObservable();
	}

	// endregion

	// region Getters / setters

	static get mechanicLine$(): Observable<MechanicLineUpdate> {
		return this._mechanicLine$;
	}

	static set mechanicLine$(value: Observable<MechanicLineUpdate>) {
		this._mechanicLine$ = value;
	}

	static get bar$(): Observable<UnassignedCardUpdate> {
		return this._bar$;
	}

	static set bar$(value: Observable<UnassignedCardUpdate>) {
		this._bar$ = value;
	}

	// endregion

	static notifyAll(): void {
		NotificationService.notifyBar();
		NotificationService.notifyMechanicLine();
	}

	static notifyBar(cardUpdate: UnassignedCardUpdate = new UnassignedCardUpdateTrigger()): void {
		this.barSubject.next(cardUpdate);
	}

	static notifyMechanicLine(day: Date = undefined, mechanicCode: string = undefined): void {
		this.mechanicLineSubject.next(new MechanicLineUpdateTrigger(day, mechanicCode));
	}
}
