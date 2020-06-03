import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {AppointmentsService} from "../../services/appointments.service";
import {Constants} from "../../objects/constants";
import {CardsService} from "../../services/cards.service";
import {AppointmentDay} from "../../objects/appointment-day";
import {NotificationService} from "../../services/notification.service";
import {AppointmentsCounter} from "../../objects/appointments-counter";
import {KeyValue} from "@angular/common";
import {Dayjs} from "dayjs";
import {AppointmentsCounterUpdate} from "../../objects/trigger-cd/update-objects/appointments-counter-update";

@Component({
	selector: 'app-appointments-panel',
	templateUrl: './appointments-panel.component.html',
	styleUrls: ['./appointments-panel.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppointmentsPanelComponent {

	@Input() day: Dayjs;
	@Input() appointmentsCounterUpdate: AppointmentsCounterUpdate;

	constructor(
		private appointmentsService: AppointmentsService,
		private cardsService: CardsService,
		private cdRef: ChangeDetectorRef
	) {}

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

	addMax(
		appointmentDay: AppointmentDay,
		day: Dayjs = this.day,
		appointmentsCounter: AppointmentsCounter = this.appointmentsCounterUpdate.value
	): void {
		this.appointmentsService.addMax(appointmentDay);
		NotificationService.notifyAppointmentsCounter(day, appointmentsCounter);
		this.cdRef.detectChanges();
	}

	subtractMax(
		appointmentDay: AppointmentDay,
		day: Dayjs = this.day,
		appointmentsCounter: AppointmentsCounter = this.appointmentsCounterUpdate.value
	): void {
		this.appointmentsService.subtractMax(appointmentDay);
		NotificationService.notifyAppointmentsCounter(day, appointmentsCounter);
		this.cdRef.detectChanges();
	}

	defaultOrder(a: KeyValue<number,string>, b: KeyValue<number,string>): number {
		return 0;
	}

}
