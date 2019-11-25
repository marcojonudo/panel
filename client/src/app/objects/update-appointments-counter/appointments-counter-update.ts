export interface AppointmentsCounterUpdate {

	appointmentTypeCode: string;
	newAppointmentsCounter: any;

	update(appointmentsCounter: any): void;

}
