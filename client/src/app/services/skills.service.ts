import {Injectable} from '@angular/core';
import {SkillEmployee} from "../objects/skills/skill-employee";
import {Skill} from "../objects/skills/skill";
import {Constants} from "../objects/constants";

@Injectable({
	providedIn: 'root'
})
export class SkillsService {

	static skills: Skill[];
	static highlightedSkills: Skill[];
	static skillEmployees: SkillEmployee[];

	static init(skills: any[], skillEmployees: any[]): void {
		this.skills = skills.map(skill => new Skill(skill));
		console.log('Skills', this.skills);
		this.highlightedSkills = this.skills.filter(skill => skill.code != undefined);
		console.log('Highlighted skills', this.highlightedSkills);
		this.skillEmployees = skillEmployees.map(skillEmployee => new SkillEmployee(skillEmployee));
		console.log('Skill employees', this.skillEmployees);
	}

	static findSkillEmployee(
		skill: Skill, employeeCode: string, skillEmployees: SkillEmployee[] = this.skillEmployees
	): SkillEmployee {
		return skillEmployees.find(skillEmployee =>
			skillEmployee.employeeCode == employeeCode && skillEmployee.skill.name == skill.name
		);
	}

	static findSkillEmployees(skill: Skill, employeeCode: string): SkillEmployee[] {
		return (skill.children.length == 0 ? [skill] : skill.children).map(s =>
			this.findSkillEmployee(s, employeeCode)
		).filter(skillEmployee => skillEmployee != undefined);
	}

	static findAllSkillEmployees(
		employeeCode: string, skillEmployees: SkillEmployee[] = this.skillEmployees
	): SkillEmployee[] {
		return skillEmployees.filter(skillEmployee => skillEmployee.employeeCode == employeeCode);
	}

	static checkExperiencedSkill(skill: Skill, employeeCode: string): boolean {
		const expertises = this.findSkillEmployees(skill, employeeCode).map(s => s.expertise);
		return !expertises.find(expertise =>
			expertise != Constants.SKILL_EXPERTISE.HIGH && expertise != Constants.SKILL_EXPERTISE.MEDIUM
		);
	}

}
