import {GenericUpdate} from "./generic-update";

export class MaxScheduleWidthUpdate implements GenericUpdate {

	trigger: boolean;
	maxScheduleWidth: number;

	constructor(maxScheduleWidth: number, notify: boolean = false) {
		this.maxScheduleWidth = maxScheduleWidth;
		this.trigger = notify;
	}

}
