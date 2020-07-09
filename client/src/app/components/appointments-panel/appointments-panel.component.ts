import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {AppointmentsService} from "../../services/appointments.service";
import {Constants} from "../../objects/constants";
import {CardsService} from "../../services/cards.service";
import {AppointmentDay} from "../../objects/appointments/appointment-day";
import {NotificationService} from "../../services/notification.service";
import {Dayjs} from "dayjs";
import {AppointmentDayUpdate} from "../../objects/trigger-cd/update-objects/appointments-counter/appointment-day-update";
import {AppointmentTypeValues} from "../../objects/appointments/appointment-type-values";

@Component({
	selector: 'app-appointments-panel',
	templateUrl: './appointments-panel.component.html',
	styleUrls: ['./appointments-panel.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppointmentsPanelComponent {

	@Input() day: Dayjs;
	@Input() appointmentDayUpdate: AppointmentDayUpdate;

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

	findAppointmentDayValues(): AppointmentTypeValues[] {
		return this.appointmentDayUpdate.value.values;
	}

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
		appointmentTypeCode: string,
		day: Dayjs = this.day,
		appointmentDay: AppointmentDay = this.appointmentDayUpdate.value
	): void {
		this.appointmentsService.addMax(appointmentDay, appointmentTypeCode);
		NotificationService.notifyAppointmentDay(day, appointmentDay);
		this.cdRef.detectChanges();
	}

	subtractMax(
		appointmentTypeCode: string,
		day: Dayjs = this.day,
		appointmentDay: AppointmentDay = this.appointmentDayUpdate.value
	): void {
		this.appointmentsService.subtractMax(appointmentDay, appointmentTypeCode);
		NotificationService.notifyAppointmentDay(day, appointmentDay);
		this.cdRef.detectChanges();
	}

}
