import {Skill} from "../skill";
import {Dayjs} from "dayjs";

export class DayMechanicSkills {

	day: Dayjs;
	mechanicCode: string;
	skills: Skill[];

	constructor(day: Dayjs = undefined, mechanicCode: string = undefined, skills: Skill[] = []) {
		this.day = day;
		this.mechanicCode = mechanicCode;
		this.skills = skills;
	}

}
