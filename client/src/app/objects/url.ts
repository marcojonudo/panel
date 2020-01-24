import {environment} from "../../environments/environment";

export class Url {

	public static initialData(): string {
		return `${environment.serverUrl}/panel/get`;
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

	public static appointmentsDaysCounters(): string {
		return `${environment.serverUrl}/panel/appointmentDay/counters`;
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

	public static appointmentDayMax(): string {
		return `${environment.serverUrl}/panel/appointmentDay/max`;
	}

	public static appointmentType(): string {
		return `${environment.serverUrl}/panel/appointment/type`;
	}

	public static appointmentSchedule(): string {
		return `${environment.serverUrl}/panel/appointment/schedule`;
	}

}
