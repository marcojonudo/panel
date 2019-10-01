import {Constants} from "./constants";
import {PersonalData} from "./personal-data";
import {Schedule} from "./schedule";
import {Skill} from "./skill";
import {CommonService} from "../services/common.service";

export class Mechanic {

	day: Date;
	position: string;
	personalData: PersonalData;
	highlightedSkills: Skill[];
	schedule: Schedule;
	lines: number;
	height: number;

	constructor(day: Date, position: string, employee: any, schedule: any, lines: number, highlightedSkills: Skill[]) {
		this.day = day;
		this.position = position;
		this.personalData = new PersonalData(employee);
		this.highlightedSkills = highlightedSkills.map(skill => {
			const employeeSkill = employee.employeeSkills.find(s => s.skill.name == skill.name);
			return new Skill(skill, employeeSkill ? employeeSkill.skillExpertise.level : undefined);
		});
		this.schedule = new Schedule(schedule);
		this.lines = lines;
		this.height = lines * Constants.VALUE.LINE_HEIGHT_DEFAULT;
	}

}
