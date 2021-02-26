import {Dayjs} from "dayjs";
import {Constants} from "../../../constants";
import {LateralPanelInfo} from "../../../lateral-panel-info/lateral-panel-info";
import {DayTriggerMapUpdate} from "../trigger-map-update/day-trigger-map-update";
import {DaysTriggerMap} from "../../trigger-maps/days-trigger-map";

export class DayLateralPanelUpdate implements DayTriggerMapUpdate {

	type: string;
	day: Dayjs;
	value: LateralPanelInfo;

	constructor(day: Dayjs, value: LateralPanelInfo) {
		this.type = Constants.UPDATE_OBJECT.LATERAL_PANEL;
		this.day = day;
		this.value = value;
	}

	updateTriggerMap(
		daysUpdateObjects: DaysTriggerMap,
		day: Dayjs = this.day,
		type: string = this.type,
		lateralPanelInfo: LateralPanelInfo = this.value
	): void {
		daysUpdateObjects[day.valueOf()][type] = lateralPanelInfo;
	}

}
