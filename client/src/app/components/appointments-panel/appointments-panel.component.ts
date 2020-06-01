import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AppointmentsService} from "../../services/appointments.service";
import {Subscription} from "rxjs/internal/Subscription";
import {Constants} from "../../objects/constants";
import {CardsService} from "../../services/cards.service";
import {AppointmentDay} from "../../objects/appointment-day";
import {NotificationService} from "../../services/notification.service";
import {DayAppointmentsCounter} from "../../objects/day-appointments-counter";
import {KeyValue} from "@angular/common";
import {Dayjs} from "dayjs";

@Component({
	selector: 'app-appointments-panel',
	templateUrl: './appointments-panel.component.html',
	styleUrls: ['./appointments-panel.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppointmentsPanelComponent implements OnInit, OnDestroy {

	@Input() day: Dayjs;
	@Input() dayAppointmentsCounter: DayAppointmentsCounter;

	private appointmentsCounterSubscription: Subscription;

	constructor(
		private appointmentsService: AppointmentsService,
		private cardsService: CardsService,
		private cdRef: ChangeDetectorRef
	) {}

	ngOnInit() {
		this.appointmentsCounterSubscription = NotificationService.appointmentsCounter$.subscribe(() => {
			this.cdRef.detectChanges();
		});
	}

	ngOnDestroy() {
		this.appointmentsCounterSubscription.unsubscribe();
	}

	// region Getters / setters

	get morningAppointmentSaturation(): number {
		return Constants.APPOINTMENT_SATURATION.MORNING;
	}

	get afternoonAppointmentSaturation(): number {
		return Constants.APPOINTMENT_SATURATION.AFTERNOON;
	}

	get timelineHeight(): number {
		return Constants.VALUE.TIMELINE_HEIGHT;
	}

	get appointmentSummaryItemHeight(): number {
		return Constants.VALUE.APPOINTMENT_SUMMARY_ITEM_HEIGHT;
	}

	// endregion

	checkSaturation(appointments: number, max: number, appointmentSaturation: number = 1): boolean {
		return this.appointmentsService.checkSaturation(appointments, max, appointmentSaturation);
	}

	findMax(max: number, appointmentsSaturation): number {
		return this.appointmentsService.findMax(max, appointmentsSaturation);
	}

	findSaturationPercentage(appointments: number, max: number, appointmentSaturation: number = 1): number {
		return this.appointmentsService.findSaturationPercentage(appointments, max, appointmentSaturation);
	}

	addMax(appointmentDay: AppointmentDay): void {
		this.appointmentsService.addMax(appointmentDay);
		this.cdRef.detectChanges();
	}

	subtractMax(appointmentDay: AppointmentDay): void {
		this.appointmentsService.subtractMax(appointmentDay);
		this.cdRef.detectChanges();
	}

	defaultOrder(a: KeyValue<number,string>, b: KeyValue<number,string>): number {
		return 0;
	}

}
