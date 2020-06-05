import {Dayjs} from "dayjs";
import {Skill} from "../../skill";
import {MechanicSkills} from "../../mechanic-skills";

export class DayMechanicSkills {

	day: Dayjs;
	mechanicSkills: MechanicSkills;

	constructor(day: Dayjs = undefined, mechanicCode: string = undefined, skills: Skill[] = undefined) {
		this.day = day;
		this.mechanicSkills = new MechanicSkills(mechanicCode, skills);
	}

}
