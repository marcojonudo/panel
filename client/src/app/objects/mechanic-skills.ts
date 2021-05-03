import {SkillEmployee} from "./skills/skill-employee";

export class MechanicSkills {

	mechanicCode: string;
	skillEmployees: SkillEmployee[];

	constructor(mechanicCode: string = undefined, skillEmployees: SkillEmployee[] = undefined) {
		this.mechanicCode = mechanicCode;
		this.skillEmployees = skillEmployees;
	}

}
