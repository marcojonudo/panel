import {Schedule} from "./schedule";
import {AppointmentType} from "./appointment-type";

export class AppointmentSchedule {

	id: number;
	mechanicId: number;
	index: number;
	appointmentType: AppointmentType;
	schedule: Schedule;

	constructor(mechanicId: number, index: number, appointmentSchedule: any = undefined) {
		this.mechanicId = mechanicId;
		this.index = index;
		if (appointmentSchedule) {
			this.id = appointmentSchedule.id;
			this.appointmentType = appointmentSchedule.appointmentType;
			this.schedule = appointmentSchedule.schedule
				? new Schedule(
					appointmentSchedule.schedule.morningStart,
					appointmentSchedule.schedule.morningEnd,
					appointmentSchedule.schedule.afternoonStart,
					appointmentSchedule.schedule.afternoonEnd
				)
				: undefined;
		}
	}

	reset(): void {
		this.appointmentType = undefined;
		this.schedule = undefined;
	}

}
