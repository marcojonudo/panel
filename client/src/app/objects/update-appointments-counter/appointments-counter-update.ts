export interface AppointmentsCounterUpdate {

	// day: Date;
	appointmentTypeCode: string;
	newDaysAppointmentsCounter: any;

	update(daysAppointmentsCounter: any): void;

}
