import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {DragScheduleContextMenuInfo} from "../../objects/context-menu/drag-schedule-context-menu-info";
import {AppointmentType} from "../../objects/appointment-type";
import {AppointmentsService} from "../../services/appointments.service";
import {Coordinates} from "../../objects/coordinates";
import {NotificationService} from "../../services/notification.service";

@Component({
	selector: 'app-drag-schedule-context-menu',
	templateUrl: './drag-schedule-context-menu.component.html',
	styleUrls: ['./drag-schedule-context-menu.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DragScheduleContextMenuComponent {

	@Input() contextMenuInfo: DragScheduleContextMenuInfo;

	findLeft(x: number): number {
		return x;
	}

	findTop(y: number): number {
		return y;
	}

	findAppointmentTypes(): AppointmentType[] {
		return AppointmentsService.appointmentTypes.filter(appointmentType => appointmentType.workingLine);
	}

	selectAppointmentType(appointmentType: AppointmentType): void {
		AppointmentsService.dragSchedulesAppointmentType = appointmentType;
		NotificationService.notifyContextMenu(undefined);
	}

}
