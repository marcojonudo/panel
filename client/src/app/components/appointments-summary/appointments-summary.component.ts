import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {AppointmentsCounter} from "../../objects/appointments-counter";
import {AppointmentsService} from "../../services/appointments.service";
import {NotificationService} from "../../services/notification.service";
import {AppointmentsDetailsInfo} from "../../objects/lateral-panel-info/appointments-details-info";
import {Constants} from "../../objects/constants";
import {KeyValue} from "@angular/common";
import {Dayjs} from "dayjs";
import {AppointmentsCounterUpdate} from "../../objects/trigger-cd/update-objects/appointments-counter/appointments-counter-update";

@Component({
	selector: 'app-appointments-summary',
	templateUrl: './appointments-summary.component.html',
	styleUrls: ['./appointments-summary.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppointmentsSummaryComponent {

	@Input() day: Dayjs;
	@Input() appointmentsCounterUpdate: AppointmentsCounterUpdate;
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

	findAppointmentsCounter(): AppointmentsCounter {
		return this.appointmentsCounterUpdate.value;
	}

	findSaturationPercentage(appointments: number, max: number, appointmentSaturation: number = 1): number {
		return this.appointmentsService.findSaturationPercentage(appointments, max, appointmentSaturation);
	}

	checkSaturation(appointments: number, max: number, appointmentSaturation: number = 1): boolean {
		return this.appointmentsService.checkSaturation(appointments, max, appointmentSaturation);
	}

	openAppointmentsDetails(
		day: Dayjs = this.day,
		appointmentsCounter: AppointmentsCounter = this.appointmentsCounterUpdate.value
	): void {
		const appointmentsDetailsInfo = this.showingLateralPanel
			? undefined : new AppointmentsDetailsInfo(appointmentsCounter);
		NotificationService.notifyLateralInfo(day, appointmentsDetailsInfo);
		this.showingLateralPanel = !this.showingLateralPanel;
	}

	defaultOrder(a: KeyValue<number,string>, b: KeyValue<number,string>): number {
		return 0;
	}

}
