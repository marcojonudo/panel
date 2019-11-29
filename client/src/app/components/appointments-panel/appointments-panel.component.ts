import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {AppointmentsService} from "../../services/appointments.service";
import {Subscription} from "rxjs/internal/Subscription";
import {Constants} from "../../objects/constants";
import {CardsService} from "../../services/cards.service";
import {AppointmentDay} from "../../objects/appointment-day";

@Component({
	selector: 'app-appointments-panel',
	templateUrl: './appointments-panel.component.html',
	styleUrls: ['./appointments-panel.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppointmentsPanelComponent implements OnInit {

	@Input() day: Date;

	private readonly TOTAL: string = 'TOTAL';
	private readonly MAX: string = 'MAX';

	private appointmentsCounterSubscription: Subscription;
	private _daysAppointmentsCounter: any;

	constructor(
		private appointmentsService: AppointmentsService,
		private cardsService: CardsService,
		private cdRef: ChangeDetectorRef
	) {}

	ngOnInit() {
		this.daysAppointmentsCounter = this.appointmentsService.daysAppointmentsCounter;
		this.appointmentsCounterSubscription = this.appointmentsService.appointmentsCounter$.subscribe(update => {
			update.update(this.daysAppointmentsCounter);
			this.cdRef.detectChanges();
		});
	}

	// region Getters / setters

	get daysAppointmentsCounter(): any {
		return this._daysAppointmentsCounter;
	}

	set daysAppointmentsCounter(value: any) {
		this._daysAppointmentsCounter = value;
	}

	get morning(): string {
		return Constants.SCHEDULE_TYPE.MORNING;
	}

	get afternoon(): string {
		return Constants.SCHEDULE_TYPE.AFTERNOON;
	}

	// endregion

	findDayAppointmentsCounter(day: Date): any {
		return this.daysAppointmentsCounter[day.getTime()];
	}

	addMax(appointmentDay: AppointmentDay): void {
		appointmentDay.max = appointmentDay.max + 1;
		this.cdRef.detectChanges();
		this.appointmentsService.updateMaxDb(appointmentDay, this.day);
	}

	subtractMax(appointmentDay: any): void {
		if (appointmentDay.max - 1 >= 0) {
			appointmentDay.max = appointmentDay.max - 1 < 0 ? appointmentDay.max : appointmentDay.max - 1;
			this.cdRef.detectChanges();
			this.appointmentsService.updateMaxDb(appointmentDay, this.day);
		}
	}

}
