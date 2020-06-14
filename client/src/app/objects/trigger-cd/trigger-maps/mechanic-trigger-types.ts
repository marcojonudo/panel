import {MechanicSkills} from "../../mechanic-skills";
import {MechanicGroupUpdate} from "../update-objects/groups/mechanic-group-update";
import {MechanicLineUpdate} from "../update-objects/mechanic-line/mechanic-line-update";

export class MechanicTriggerTypes {

	mechanicSkills: MechanicSkills;
	mechanicLine: MechanicLineUpdate[];
	group: MechanicGroupUpdate;

	constructor() {
		this.mechanicSkills = new MechanicSkills();
		this.mechanicLine = undefined;
		this.group = undefined;
	}

}
