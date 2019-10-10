import {Constants} from "./constants";
import {PersonalData} from "./personal-data";
import {Schedule} from "./schedule";
import {Skill} from "./skill";
import {CommonService} from "../services/common.service";

export class Mechanic {

	day: Date;
	code: string;
	panelPosition: string;
	personalData: PersonalData;
	skills: Skill[];
	highlightedSkills: Skill[];
	schedule: Schedule;
	lines: number;
	height: number;

	constructor(
		day: Date,
		position: string,
		employee: any,
		schedule: any,
		lines: number,
		skills: any[],
		highlightedSkills: Skill[]
	) {
		this.day = day;
		this.code = employee.code;
		this.panelPosition = position;
		this.personalData = new PersonalData(employee);
		this.skills = skills.map(skill => {
			const children = skill.children.map(child => {
				const employeeSkill = employee.employeeSkills.find(s => s.skill.name == child.name);
				return new Skill(child, employeeSkill ? employeeSkill.skillExpertise.level : undefined);
			});
			/* La experiencia es siempre undefined, ya que las categorías padre no tienen especialización por parte de
			*  los empleados. Sólo sirven para estructurar las habilidades */
			return new Skill(skill, undefined, children);
		});
		this.highlightedSkills = highlightedSkills.map(skill => {
			const employeeSkill = employee.employeeSkills.find(s => s.skill.name == skill.name);
			return new Skill(skill, employeeSkill ? employeeSkill.skillExpertise.level : undefined);
		});
		this.schedule = new Schedule(schedule);
		this.lines = lines;
		this.height = lines * Constants.VALUE.LINE_HEIGHT_DEFAULT;
	}

}
