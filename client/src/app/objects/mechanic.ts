import {Constants} from "./constants";
import {PersonalData} from "./personal-data";
import {Schedule} from "./schedule";
import {Skill} from "./skill";
import {CommonService} from "../services/common.service";
import {AppointmentSchedule} from "./appointment-schedule";

export class Mechanic {

	id: number;
	day: Date;
	code: string;
	panelPosition: string;
	personalData: PersonalData;
	skills: Skill[];
	highlightedSkills: Skill[];
	schedule: Schedule;
	lines: number;
	showInPanel: boolean;
	height: number;
	appointmentsSchedules: AppointmentSchedule[];

	constructor(
		day: Date,
		mechanic: any,
		skills: any[],
		highlightedSkills: Skill[],
	) {
		this.id = mechanic.id;
		this.day = day;
		this.code = mechanic.employee.code;
		this.panelPosition = mechanic.panelPosition;
		this.personalData = new PersonalData(mechanic.employee);
		this.skills = skills.map(skill => {
			const children = skill.children.map(child => {
				const employeeSkill = mechanic.employee.employeeSkills.find(s => s.skill.name == child.name);
				return new Skill(child, employeeSkill ? employeeSkill.skillExpertise.level : undefined);
			});
			/* La experiencia es siempre undefined, ya que las categorías padre no tienen especialización por parte de
			*  los empleados. Sólo sirven para estructurar las habilidades */
			return new Skill(skill, undefined, children);
		});
		this.highlightedSkills = highlightedSkills.map(skill => {
			const employeeSkill = mechanic.employee.employeeSkills.find(s => s.skill.name == skill.name);
			return new Skill(skill, employeeSkill ? employeeSkill.skillExpertise.level : undefined);
		});
		this.schedule = new Schedule(mechanic.schedule);
		this.lines = mechanic.lines;
		this.showInPanel = mechanic.showInPanel;
		this.height = this.lines * Constants.VALUE.LINE_HEIGHT_DEFAULT;
		this.appointmentsSchedules = mechanic.appointments.map(appointment => new AppointmentSchedule(appointment));
	}

}
