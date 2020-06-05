import {Constants} from "../../constants";
import {UpdateObject} from "./update-object";
import {LateralPanelInfo} from "../../lateral-panel-info/lateral-panel-info";
import {DaysUpdateObjects} from "../days-update-objects";
import {Dayjs} from "dayjs";
import {DayLateralPanelInfo} from "../day-update/day-lateral-panel-info";

export class DayLateralPanelUpdate implements UpdateObject {

	type: string;
	value: DayLateralPanelInfo;

	constructor(value: DayLateralPanelInfo) {
		this.type = Constants.UPDATE_OBJECT.LATERAL_PANEL;
		this.value = value;
	}

	updateObjects(
		daysUpdateObjects: DaysUpdateObjects,
		day: Dayjs = this.value.day,
		lateralPanelInfo: LateralPanelInfo = this.value.info,
		type: string = this.type
	): void {
		daysUpdateObjects[day.valueOf()][type] = lateralPanelInfo;
	}

}
