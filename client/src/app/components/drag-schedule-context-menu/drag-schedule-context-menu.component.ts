import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {AppointmentType} from "../../objects/appointment-type";
import {AppointmentsService} from "../../services/appointments.service";
import {NotificationService} from "../../services/notification.service";

@Component({
	selector: 'app-drag-schedule-context-menu',
	templateUrl: './drag-schedule-context-menu.component.html',
	styleUrls: ['./drag-schedule-context-menu.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DragScheduleContextMenuComponent {

	findAppointmentTypes(): AppointmentType[] {
		return AppointmentsService.appointmentTypes.filter(appointmentType => appointmentType.workingLine);
	}

	selectAppointmentType(appointmentType: AppointmentType): void {
		AppointmentsService.dragSchedulesAppointmentType = appointmentType;
		NotificationService.notifyContextMenu(undefined, true);
	}

}
