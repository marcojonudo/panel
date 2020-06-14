import {MechanicSkills} from "../../../mechanic-skills";
import {Constants} from "../../../constants";
import {MechanicsTriggerMap} from "../../trigger-maps/mechanics-trigger-map";
import {MechanicTriggerMapUpdate} from "../trigger-map-update/mechanic-trigger-map-update";

export class MechanicSkillsUpdate implements MechanicTriggerMapUpdate {

	type: string;
	mechanicCode: string;
	value: MechanicSkills;

	constructor(mechanicCode: string = undefined, value: MechanicSkills = new MechanicSkills()) {
		this.type = Constants.UPDATE_OBJECT.MECHANIC_SKILLS;
		this.mechanicCode = mechanicCode;
		this.value = value;
	}

	updateTriggerMap(
		mechanicsTriggerMap: MechanicsTriggerMap,
		mechanicCode: string,
		type: string = this.type,
		mechanicSkills: MechanicSkills = this.value
	): void {
		if (mechanicCode == this.mechanicCode) {
			mechanicsTriggerMap[this.mechanicCode][type] = this.value;
		} else if (this.mechanicCode && this.mechanicCode != mechanicCode && mechanicsTriggerMap[this.mechanicCode][type].skills) {
			mechanicsTriggerMap[this.mechanicCode][type] = new MechanicSkills(this.mechanicCode, undefined);
		}
	}

}
