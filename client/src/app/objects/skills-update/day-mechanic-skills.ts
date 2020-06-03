import {Skill} from "../skill";
import {Dayjs} from "dayjs";
import {MechanicSkills} from "../mechanic-skills";

export class DayMechanicSkills {

	day: Dayjs;
	mechanicSkills: MechanicSkills;

	constructor(day: Dayjs = undefined, mechanicCode: string = undefined, skills: Skill[] = undefined) {
		this.day = day;
		this.mechanicSkills = new MechanicSkills(mechanicCode, skills);
	}

}
