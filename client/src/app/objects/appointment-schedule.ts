import {Schedule} from "./schedule";
import {AppointmentType} from "./appointment-type";
import {Mechanic} from "./mechanic";

export class AppointmentSchedule {

	id: number;
	appointmentType: AppointmentType;
	schedule: Schedule;

	constructor(mechanic: Mechanic, appointmentSchedule: any) {
		this.id = appointmentSchedule.id;
		this.appointmentType = appointmentSchedule.appointmentType;
		this.schedule = appointmentSchedule.schedule
			? new Schedule(
				appointmentSchedule.schedule.morningStart,
				appointmentSchedule.schedule.morningEnd,
				appointmentSchedule.schedule.afternoonStart,
				appointmentSchedule.schedule.afternoonEnd,
				appointmentSchedule.schedule.id
			)
			: undefined;
	}

	reset(): void {
		this.appointmentType = undefined;
		this.schedule = undefined;
	}

}
