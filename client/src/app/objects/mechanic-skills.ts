import {Skill} from "./skill";

export class MechanicSkills {

	mechanicCode: string;
	skills: Skill[];

	constructor(mechanicCode: string = undefined, skills: Skill[] = undefined) {
		this.mechanicCode = mechanicCode;
		this.skills = skills;
	}

}
