import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {DayAppointmentsCounter} from "../../objects/day-appointments-counter";
import {AppointmentsService} from "../../services/appointments.service";
import {NotificationService} from "../../services/notification.service";
import {DayLateralPanelInfo} from "../../objects/lateral-panel-info/day-lateral-panel-info";
import {AppointmentsDetailsInfo} from "../../objects/lateral-panel-info/appointments-details-info";
import {Constants} from "../../objects/constants";
import {DayAppointmentsCounterUpdate} from "../../objects/appointments-counter-update/day-appointments-counter-update";

@Component({
	selector: 'app-appointments-summary',
	templateUrl: './appointments-summary.component.html',
	styleUrls: ['./appointments-summary.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppointmentsSummaryComponent {

	@Input() day: Date;
	@Input() dayAppointmentsCounterUpdate: DayAppointmentsCounterUpdate;
	@Input() width: number;

	private showingLateralPanel: boolean;

	constructor(
		private appointmentsService: AppointmentsService
	) {
		this.showingLateralPanel = false;
	}

	// region Getters / setters

	get timelineHeight(): number {
		return Constants.VALUE.TIMELINE_HEIGHT;
	}

	get appointmentSummaryItemHeight(): number {
		return Constants.VALUE.APPOINTMENT_SUMMARY_ITEM_HEIGHT;
	}

	// endregion

	findDayAppointmentsCounter(day: Date = this.day): DayAppointmentsCounter {
		return this.appointmentsService.daysAppointmentsCounter[day.getTime()];
	}

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
					this.showingLateralPanel ? undefined : this.findDayAppointmentsCounter()
				)
			)
		);
		this.showingLateralPanel = !this.showingLateralPanel;
	}

}
