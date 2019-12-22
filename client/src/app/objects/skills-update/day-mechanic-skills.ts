import {Skill} from "../skill";

export class DayMechanicSkills {

	day: Date;
	mechanicCode: string;
	skills: Skill[];

	constructor(day: Date, mechanicCode: string, skills: Skill[]) {
		this.day = day;
		this.mechanicCode = mechanicCode;
		this.skills = skills;
	}

}
