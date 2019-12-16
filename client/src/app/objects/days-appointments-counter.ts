import {AppointmentDay} from "./appointment-day";

export interface DaysAppointmentsCounter {

	[key: number]: { [key: string]: AppointmentDay };

}
