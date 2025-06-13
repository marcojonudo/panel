import {Injectable} from '@angular/core';
import {SkillEmployee} from "../objects/skills/skill-employee";
import {Skill} from "../objects/skills/skill";
import {Constants} from "../objects/constants";
import { Observable, of } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { Url } from '../objects/url';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class SkillService {

	static skills: Skill[];
	static skills2: Skill[];
	static highlightedSkills: Skill[];
	static skillEmployees: SkillEmployee[];

	constructor(private http: HttpClient) {}

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

	findSkills(): Observable<any> {
		const savedSkills = LocalStorageService.getItem(Constants.LOCAL_STORAGE.SKILLS);
		return (savedSkills ? of(savedSkills) : this.http.get(Url.skills())).pipe(
			tap(skills => {
				SkillService.skills2 = skills.map(s => new Skill(s));
				LocalStorageService.setItem(Constants.LOCAL_STORAGE.SKILLS, SkillService.skills2);
				console.log('Skills', SkillService.skills2);
				SkillService.highlightedSkills = SkillService.skills2.filter(skill => skill.code != undefined);
				console.log('Highlighted skills', SkillService.highlightedSkills);
			})
		);
	}

}
