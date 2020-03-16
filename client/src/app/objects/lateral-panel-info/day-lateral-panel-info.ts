import {LateralPanelInfo} from "./lateral-panel-info";
import {Dayjs} from "dayjs";

export class DayLateralPanelInfo {

	day: Dayjs;
	info: LateralPanelInfo;

	constructor(day: Dayjs = undefined, info: LateralPanelInfo = undefined) {
		this.day = day;
		this.info = info;
	}

}
