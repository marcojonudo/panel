import {Dayjs} from "dayjs";
import {LateralPanelInfo} from "../../lateral-panel-info/lateral-panel-info";

export class DayLateralPanelInfo {

	day: Dayjs;
	info: LateralPanelInfo;

	constructor(day: Dayjs = undefined, info: LateralPanelInfo = undefined) {
		this.day = day;
		this.info = info;
	}

}
