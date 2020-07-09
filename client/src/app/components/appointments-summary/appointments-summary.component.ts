import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {AppointmentsService} from "../../services/appointments.service";
import {NotificationService} from "../../services/notification.service";
import {AppointmentsDetailsInfo} from "../../objects/lateral-panel-info/appointments-details-info";
import {Constants} from "../../objects/constants";
import {Dayjs} from "dayjs";
import {AppointmentDayUpdate} from "../../objects/trigger-cd/update-objects/appointments-counter/appointment-day-update";
import {AppointmentDay} from "../../objects/appointments/appointment-day";
import {AppointmentTypeValues} from "../../objects/appointments/appointment-type-values";

@Component({
	selector: 'app-appointments-summary',
	templateUrl: './appointments-summary.component.html',
	styleUrls: ['./appointments-summary.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppointmentsSummaryComponent {

	@Input() day: Dayjs;
	@Input() appointmentDayUpdate: AppointmentDayUpdate;
	@Input() width: number;
	@Input() enabled: boolean;

	private showingLateralPanel: boolean;

	constructor(private appointmentsService: AppointmentsService) {
		this.showingLateralPanel = false;
	}

	// region Getters / setters

	get timelineHeight(): number {
		return Constants.VALUE.TIMELINE_HEIGHT;
	}

	get appointmentSummaryItemHeight(): number {
		return Constants.VALUE.APPOINTMENT_SUMMARY_ITEM_HEIGHT;
	}

	get morningAppointmentSaturation(): number {
		return Constants.APPOINTMENT_SATURATION.MORNING;
	}

	get afternoonAppointmentSaturation(): number {
		return Constants.APPOINTMENT_SATURATION.AFTERNOON;
	}

	// endregion

	findAppointmentDayValues(): AppointmentTypeValues[] {
		return this.appointmentDayUpdate.value.values;
	}

	findSaturationPercentage(appointments: number, max: number, appointmentSaturation: number = 1): number {
		return this.appointmentsService.findSaturationPercentage(appointments, max, appointmentSaturation);
	}

	checkSaturation(appointments: number, max: number, appointmentSaturation: number = 1): boolean {
		return this.appointmentsService.checkSaturation(appointments, max, appointmentSaturation);
	}

	openAppointmentsDetails(
		day: Dayjs = this.day,
		appointmentDay: AppointmentDay = this.appointmentDayUpdate.value
	): void {
		const appointmentsDetailsInfo = this.showingLateralPanel
			? undefined : new AppointmentsDetailsInfo(appointmentDay);
		this.showingLateralPanel = !this.showingLateralPanel;
		NotificationService.notifyLateralInfo(day, appointmentsDetailsInfo, true);
	}

}
