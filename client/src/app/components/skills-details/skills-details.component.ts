import {
	ChangeDetectionStrategy,
	Component,
	Input,
} from '@angular/core';
import {Skill} from "../../objects/skill";
import {SkillsDetailsInfo} from "../../objects/lateral-panel-info/skills-details-info";
import {MechanicSkills} from "../../objects/mechanic-skills";

@Component({
	selector: 'app-skills-details',
	templateUrl: './skills-details.component.html',
	styleUrls: ['./skills-details.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkillsDetailsComponent {

	@Input() mechanicSkills: MechanicSkills;

	private SKILL_EXPERTISE_COLOR: any = {
		LOW: '#FF0000',
		MEDIUM: '#FFFF00',
		HIGH: '#008000'
	};

	getSkillExpertiseColor(skill: Skill) {
		return this.SKILL_EXPERTISE_COLOR[skill.expertise];
	}

	buildAllSkillsArray(parentSkills: Skill[] = this.mechanicSkills.skills): Skill[] {
		const skills = [];
		parentSkills.forEach((parent: Skill) => {
			skills.push(parent);
			parent.children.forEach((child: Skill) => {
				skills.push(child);
			});
		});
		return skills;
	}

}
