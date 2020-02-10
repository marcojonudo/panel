import {LateralPanelInfo} from "./lateral-panel-info";
import {Constants} from "../constants";
import {DaysMechanicSkills} from "../days-mechanic-skills";
import {DayMechanicSkills} from "../skills-update/day-mechanic-skills";
import {MechanicSkills} from "../mechanic-skills";

export class SkillsDetailsInfo implements LateralPanelInfo {

	type: string;
	params: MechanicSkills;
	show: boolean;

	constructor(mechanicSkills: MechanicSkills) {
		this.type = Constants.LATERAL_PANEL_INFO_TYPE.SKILLS;
		this.params = mechanicSkills;
		this.show = mechanicSkills && mechanicSkills.skills.length != 0;
	}

	handle(daysMechanicSkills: DaysMechanicSkills, day: Date): void {
		daysMechanicSkills[day.getTime()] = new DayMechanicSkills(day, this.params.mechanicCode, this.params.skills)
	}

}
