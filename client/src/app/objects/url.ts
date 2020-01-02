import {environment} from "../../environments/environment";

export class Url {

	public static getInitialData(): string {
		return `${environment.serverUrl}/panel/get`;
	}

	public static updateMechanicsPosition(): string {
		return `${environment.serverUrl}/panel/mechanic/position`;
	}

	public static updateMechanicLines(): string {
		return `${environment.serverUrl}/panel/mechanic/lines`;
	}

	public static updateAppointmentsDays(): string {
		return `${environment.serverUrl}/panel/appointmentDay/counters`;
	}

	public static updateCardsPosition(): string {
		return `${environment.serverUrl}/panel/cards/position`;
	}

}
