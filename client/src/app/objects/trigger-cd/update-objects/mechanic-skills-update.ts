import {Constants} from "../../constants";
import {UpdateObject} from "./update-object";
import {MechanicSkills} from "../../mechanic-skills";
import {MechanicsUpdateObjects} from "../mechanics-update-objects";

export class MechanicSkillsUpdate implements UpdateObject {

	type: string;
	value: MechanicSkills;

	constructor(value: MechanicSkills) {
		this.type = Constants.TRIGGER_CD_UPDATE_PROPERTY.MECHANIC_SKILLS;
		this.value = value;
	}

	updateObjects(
		processedMechanicCode: string,
		mechanicsUpdateObjects: MechanicsUpdateObjects,
		mechanicSkills: MechanicSkills = this.value,
		type: string = this.type
	): void {
		if (mechanicSkills.mechanicCode == processedMechanicCode) {
			mechanicsUpdateObjects[mechanicSkills.mechanicCode][type] = this.value;
		} else if (mechanicSkills.mechanicCode && mechanicSkills.mechanicCode != processedMechanicCode && mechanicsUpdateObjects[mechanicSkills.mechanicCode][type].skills) {
			mechanicsUpdateObjects[mechanicSkills.mechanicCode][type] = new MechanicSkills(mechanicSkills.mechanicCode, undefined);
		}
	}

}
