import {MechanicSkills} from "../../mechanic-skills";
import {MechanicLineUpdate} from "../update-objects/mechanic-line/mechanic-line-update";
import {GroupTriggerMapUpdate} from "../update-objects/trigger-map-update/group-trigger-map-update";

export class MechanicTriggerTypes {

	mechanicSkills: MechanicSkills;
	mechanicLine: MechanicLineUpdate[];
	groups: GroupTriggerMapUpdate[];

	constructor() {
		this.mechanicSkills = new MechanicSkills();
		this.mechanicLine = undefined;
		this.groups = [];
	}

}
