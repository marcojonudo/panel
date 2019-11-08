export class AppointmentType {

	name: string;
	code: string;
	ownSchedule: boolean;
	numberIndicator: boolean;
	color: string;

	constructor(appointmentType: any) {
		this.name = appointmentType.name;
		this.code = appointmentType.code;
		this.ownSchedule = appointmentType.ownSchedule;
		this.numberIndicator = appointmentType.numberIndicator;
		this.color = appointmentType.name;
	}

}
