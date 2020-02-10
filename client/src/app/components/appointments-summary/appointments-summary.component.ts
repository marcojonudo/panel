import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {DayAppointmentsCounter} from "../../objects/day-appointments-counter";
import {AppointmentsService} from "../../services/appointments.service";
import {NotificationService} from "../../services/notification.service";
import {DayLateralPanelInfo} from "../../objects/lateral-panel-info/day-lateral-panel-info";
import {AppointmentsDetailsInfo} from "../../objects/lateral-panel-info/appointments-details-info";
import {Constants} from "../../objects/constants";

@Component({
	selector: 'app-appointments-summary',
	templateUrl: './appointments-summary.component.html',
	styleUrls: ['./appointments-summary.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppointmentsSummaryComponent {

	@Input() day: Date;
	@Input() dayAppointmentsCounter: DayAppointmentsCounter;

	constructor(private appointmentsService: AppointmentsService) {}

	findSaturationPercentage(appointments: number, max: number, appointmentSaturation: number = 1): number {
		return this.appointmentsService.findSaturationPercentage(appointments, max, appointmentSaturation);
	}

	checkSaturation(appointments: number, max: number, appointmentSaturation: number = 1): boolean {
		return this.appointmentsService.checkSaturation(appointments, max, appointmentSaturation);
	}

	openAppointmentsDetails(day: Date = this.day): void {
		NotificationService.notifyLateralInfo(
			new DayLateralPanelInfo(
				day,
				new AppointmentsDetailsInfo(
					this.dayAppointmentsCounter
				)
			)
		);
	}

}
