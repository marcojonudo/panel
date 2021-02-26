export class AppointmentType {

	name: string;
	code: string;
	workingLine: boolean;
	counter: boolean;
	color: string;

	constructor(appointmentType: any) {
		this.name = appointmentType.name;
		this.code = appointmentType.code;
		this.workingLine = appointmentType.workingLine;
		this.counter= appointmentType.counter;
		this.color = appointmentType.color;
	}

}
