import {environment} from "../../environments/environment";

export class Url {

	public static createAppointmentDays(): string {
		return `${environment.serverUrl}/panel/appointmentDay`;
	}

	public static updateAppointmentsDays(): string {
		return `${environment.serverUrl}/panel/appointmentDay/counters`;
	}

}
