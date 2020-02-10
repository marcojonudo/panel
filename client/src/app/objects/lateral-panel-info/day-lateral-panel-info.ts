import {LateralPanelInfo} from "./lateral-panel-info";

export class DayLateralPanelInfo {

	day: Date;
	info: LateralPanelInfo;

	constructor(day: Date = undefined, info: LateralPanelInfo = undefined) {
		this.day = day;
		this.info = info;
	}

}
