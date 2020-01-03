import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {AppointmentsService} from "../../services/appointments.service";
import {Subscription} from "rxjs/internal/Subscription";
import {Constants} from "../../objects/constants";
import {CardsService} from "../../services/cards.service";
import {AppointmentDay} from "../../objects/appointment-day";
import {NotificationService} from "../../services/notification.service";

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
		this.appointmentsCounterSubscription = NotificationService.appointmentsCounter$.subscribe(update => {
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

	get morningAppointmentSaturation(): number {
		return Constants.APPOINTMENT_SATURATION.MORNING;
	}

	get afternoonAppointmentSaturation(): number {
		return Constants.APPOINTMENT_SATURATION.AFTERNOON;
	}

	// endregion

	findDayAppointmentsCounter(day: Date): any {
		return this.daysAppointmentsCounter[day.getTime()];
	}

	checkSaturation(appointments: number, max: number, appointmentSaturation: number = 1): boolean {
		return appointments > Math.round(max * appointmentSaturation);
	}

	addMax(appointmentDay: AppointmentDay): void {
		this.appointmentsService.addMax(appointmentDay);
		this.cdRef.detectChanges();
	}

	subtractMax(appointmentDay: AppointmentDay): void {
		this.appointmentsService.subtractMax(appointmentDay);
		this.cdRef.detectChanges();
	}

}
