export class UpdateAppointmentDayParams {

	updateAll: boolean;
	updateTotal: boolean;
	lastDay: boolean;

	constructor(lastDay: boolean, updateAll: boolean, updateTotal: boolean = undefined) {
		this.lastDay = lastDay;
		this.updateAll = updateAll;
		this.updateTotal = updateTotal ? updateTotal : this.updateAll;
	}

}
