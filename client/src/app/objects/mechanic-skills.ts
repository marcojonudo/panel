import {Skill} from "./skill";

export class MechanicSkills {

	mechanicCode: string;
	skills: Skill[];

	constructor(mechanicCode: string, skills: Skill[]) {
		this.mechanicCode = mechanicCode;
		this.skills = skills;
	}

}
