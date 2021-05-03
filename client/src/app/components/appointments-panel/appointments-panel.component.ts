import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {AppointmentsService} from "../../services/appointments.service";
import {Constants} from "../../objects/constants";
import {CardsService} from "../../services/cards.service";
import {AppointmentDay} from "../../objects/appointments/appointment-day";
import {NotificationService} from "../../services/notification.service";
import {Dayjs} from "dayjs";
import {AppointmentDayUpdate} from "../../objects/trigger-cd/update-objects/appointments-counter/appointment-day-update";
import {AppointmentTypeValues} from "../../objects/appointments/appointment-type-values";
import {AppointmentType} from "../../objects/appointments/appointment-type";

@Component({
	selector: 'app-appointments-panel',
	templateUrl: './appointments-panel.component.html',
	styleUrls: ['./appointments-panel.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppointmentsPanelComponent implements OnChanges {

	@Input() day: Dayjs;
	@Input() appointmentDayUpdate: AppointmentDayUpdate;

	valuesMap: {[key: string]: AppointmentTypeValues};

	constructor(
		private appointmentsService: AppointmentsService,
		private cardsService: CardsService,
		private cdRef: ChangeDetectorRef
	) {
		this.valuesMap = {};
		this.findAppointmentTypes().forEach(appointmentType => {
			this.valuesMap[appointmentType.code] = new AppointmentTypeValues({});
		});
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.appointmentDayUpdate && changes.appointmentDayUpdate.currentValue) {
			this.appointmentDayUpdate.value.values.forEach(appointmentTypeValues => {
				this.valuesMap[appointmentTypeValues.appointmentType.code] = appointmentTypeValues;
			})
		}
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

	findAppointmentTypes(): AppointmentType[] {
		return AppointmentsService.findAppointmentTypes(true);
	}

	findValues(
		appointmentTypeCode: string, valuesMap: {[key: string]: AppointmentTypeValues} = this.valuesMap
	): AppointmentTypeValues {
		return valuesMap[appointmentTypeCode];
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
		appointmentDay: AppointmentDay = this.appointmentDayUpdate.value
	): void {
		this.appointmentsService.addMax(appointmentDay, appointmentTypeCode);
		NotificationService.notifyAppointmentDay(appointmentDay);
		this.cdRef.detectChanges();
	}

	subtractMax(
		appointmentTypeCode: string,
		appointmentDay: AppointmentDay = this.appointmentDayUpdate.value
	): void {
		this.appointmentsService.subtractMax(appointmentDay, appointmentTypeCode);
		NotificationService.notifyAppointmentDay(appointmentDay);
		this.cdRef.detectChanges();
	}

}
