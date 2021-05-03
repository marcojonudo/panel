import {
	ChangeDetectionStrategy,
	Component,
	Input,
} from '@angular/core';
import {MechanicSkills} from "../../objects/mechanic-skills";
import {Skill} from "../../objects/skills/skill";
import {SkillsService} from "../../services/skills.service";

@Component({
	selector: 'app-skills-details',
	templateUrl: './skills-details.component.html',
	styleUrls: ['./skills-details.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkillsDetailsComponent {

	@Input() mechanicSkills: MechanicSkills;

	buildAllSkillsArray(skills: Skill[] = SkillsService.skills): Skill[] {
		const parentSkills = skills.filter(s => s.children.length > 0);
		const sortedSkills = [];
		parentSkills.forEach(parentSkill => {
			sortedSkills.push(parentSkill);
			parentSkill.children.forEach(skill => {
				sortedSkills.push(skill);
			})
		})
		return sortedSkills;
	}

	findSkillBadgeStyle(skill: Skill, mechanicSkills: MechanicSkills = this.mechanicSkills): any {
		let highExpertise = undefined;
		if (mechanicSkills) {
			highExpertise = SkillsService.checkExperiencedSkill(skill, mechanicSkills.mechanicCode);
		}
		return highExpertise ? skill.code.style.toStyle() : undefined;
	}

	findExpertise(skill: Skill, mechanicSkills: MechanicSkills = this.mechanicSkills): string {
		return mechanicSkills && mechanicSkills.skillEmployees ?
			mechanicSkills.skillEmployees.find(skillEmployee => skillEmployee.skill.name == skill.name).expertise :
			undefined;
	}

	findExpertiseBadgeClass(skill: Skill): string {
		return `expertise-badge-${this.findExpertise(skill)}`
	}

}
