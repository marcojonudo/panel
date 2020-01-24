import {
	ChangeDetectionStrategy,
	Component,
	Input,
} from '@angular/core';
import {Skill} from "../../objects/skill";
import {Constants} from "../../objects/constants";

@Component({
	selector: 'app-skills-details',
	templateUrl: './skills-details.component.html',
	styleUrls: ['./skills-details.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkillsDetailsComponent {

	@Input() skills: Skill[];

	private SKILL_EXPERTISE_COLOR: any = {
		LOW: '#FF0000',
		MEDIUM: '#FFFF00',
		HIGH: '#008000'
	};

	// region Getters / setters

	get skillsPanelWidth(): number {
		return Constants.VALUE.SKILLS_PANEL_WIDTH;
	}

	// endregion

	getSkillExpertiseColor(skill: Skill) {
		return this.SKILL_EXPERTISE_COLOR[skill.expertise];
	}

}
