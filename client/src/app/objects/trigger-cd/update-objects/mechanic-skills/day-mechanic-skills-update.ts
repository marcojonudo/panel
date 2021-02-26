import {Dayjs} from "dayjs";
import {Constants} from "../../../constants";
import {MechanicSkills} from "../../../mechanic-skills";
import {SkillsDetailsInfo} from "../../../lateral-panel-info/skills-details-info";
import {MechanicSkillsUpdate} from "./mechanic-skills-update";
import {DayTriggerMapUpdate} from "../trigger-map-update/day-trigger-map-update";
import {DaysTriggerMap} from "../../trigger-maps/days-trigger-map";

export class DayMechanicSkillsUpdate implements DayTriggerMapUpdate {

	type: string;
	day: Dayjs;
	value: MechanicSkills;

	constructor(day: Dayjs, value: MechanicSkills) {
		this.type = Constants.UPDATE_OBJECT.MECHANIC_SKILLS;
		this.day = day;
		this.value = value;
	}

	updateTriggerMap(
		daysUpdateObjects: DaysTriggerMap,
		day: Dayjs = this.day,
		type: string = this.type,
		mechanicSkills: MechanicSkills = this.value,
	): void {
		daysUpdateObjects[day.valueOf()][type] = new MechanicSkillsUpdate(mechanicSkills.mechanicCode, mechanicSkills);
		daysUpdateObjects[day.valueOf()][Constants.UPDATE_OBJECT.LATERAL_PANEL] =
			new SkillsDetailsInfo(mechanicSkills);
	}

}
