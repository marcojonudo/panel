import {Constants} from "../../constants";
import {UpdateObject} from "./update-object";
import {LateralPanelInfo} from "../../lateral-panel-info/lateral-panel-info";
import {DayLateralPanelInfo} from "../../lateral-panel-info/day-lateral-panel-info";
import {DaysUpdateObjects} from "../days-update-objects";
import {Dayjs} from "dayjs";

export class DayLateralPanelUpdate implements UpdateObject {

	type: string;
	value: DayLateralPanelInfo;

	constructor(value: DayLateralPanelInfo) {
		this.type = Constants.TRIGGER_CD_UPDATE_PROPERTY.LATERAL_PANEL;
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
