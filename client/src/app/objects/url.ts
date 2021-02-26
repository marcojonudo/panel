import {environment} from "../../environments/environment";

export class Url {

	public static initialData(): string {
		return `${environment.serverUrl}/panel`;
	}

	public static mechanicsPosition(): string {
		return `${environment.serverUrl}/panel/mechanic/position`;
	}

	public static mechanicLines(): string {
		return `${environment.serverUrl}/panel/mechanic/lines`;
	}

	public static mechanicJobLineType(): string {
		return `${environment.serverUrl}/panel/mechanic/jobLineType`;
	}

	public static cards(): string {
		return `${environment.serverUrl}/panel/cards`;
	}

	public static cardsPosition(): string {
		return `${environment.serverUrl}/panel/cards/position`;
	}

	public static cardsDuration(): string {
		return `${environment.serverUrl}/panel/cards/duration`;
	}

	public static cardsDivision(): string {
		return `${environment.serverUrl}/panel/cards/division`;
	}

	public static cardsLinks(): string {
		return `${environment.serverUrl}/panel/cards/links`;
	}

	public static resetCardsLinks(): string {
		return `${environment.serverUrl}/panel/cards/resetLinks`;
	}

	public static cardsDeletion(): string {
		return `${environment.serverUrl}/panel/cards/delete`;
	}

	public static cardsVehiclePosition(): string {
		return `${environment.serverUrl}/panel/cards/vehiclePosition`;
	}

	public static cardsPendingCall(): string {
		return `${environment.serverUrl}/panel/cards/pendingCall`;
	}

	public static cardsPendingBudget(): string {
		return `${environment.serverUrl}/panel/cards/pendingBudget`;
	}

	public static appointmentDays(): string {
		return `${environment.serverUrl}/panel/appointmentDays`;
	}

	public static appointmentType(): string {
		return `${environment.serverUrl}/panel/appointment/type`;
	}

	public static appointment(): string {
		return `${environment.serverUrl}/panel/appointment`;
	}

	public static appointmentSchedule(): string {
		return `${environment.serverUrl}/panel/appointment/schedule`;
	}

	public static syncJpdv(): string {
		return `${environment.serverUrl}/panel/syncJpdv`;
	}

	public static publisher(): string {
		return `${environment.serverUrl}/panel/publisher`;
	}

}
