import {LateralPanelInfo} from "./lateral-panel-info";
import {Constants} from "../constants";
import {MechanicSkills} from "../mechanic-skills";

export class SkillsDetailsInfo implements LateralPanelInfo {

	type: string;
	params: MechanicSkills;
	show: boolean;

	constructor(mechanicSkills: MechanicSkills) {
		this.type = Constants.UPDATE_OBJECT.MECHANIC_SKILLS;
		this.params = mechanicSkills;
		this.show = mechanicSkills && mechanicSkills.skillEmployees != undefined;
	}

}
