import {Constants} from "../../constants";
import {UpdateObject} from "./update-object";
import {MechanicSkills} from "../../mechanic-skills";
import {DayMechanicSkills} from "../../skills-update/day-mechanic-skills";
import {DaysUpdateObjects} from "../days-update-objects";
import {Dayjs} from "dayjs";
import {MechanicSkillsUpdate} from "./mechanic-skills-update";
import {SkillsDetailsInfo} from "../../lateral-panel-info/skills-details-info";

export class DayMechanicSkillsUpdate implements UpdateObject {

	type: string;
	value: DayMechanicSkills;

	constructor(value: DayMechanicSkills) {
		this.type = Constants.TRIGGER_CD_UPDATE_PROPERTY.MECHANIC_SKILLS;
		this.value = value;
	}

	updateObjects(
		daysUpdateObjects: DaysUpdateObjects,
		day: Dayjs = this.value.day,
		mechanicSkills: MechanicSkills = this.value.mechanicSkills,
		type: string = this.type
	): void {
		daysUpdateObjects[day.valueOf()][type] = new MechanicSkillsUpdate(mechanicSkills);
		daysUpdateObjects[day.valueOf()][Constants.TRIGGER_CD_UPDATE_PROPERTY.LATERAL_PANEL] =
			new SkillsDetailsInfo(mechanicSkills);
	}

}
