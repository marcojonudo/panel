import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	EventEmitter, Input,
	OnDestroy,
	OnInit,
	Output
} from '@angular/core';
import {CommonService} from "../../services/common.service";
import {Skill} from "../../objects/skill";
import {Subscription} from "rxjs/internal/Subscription";

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

	private DEFAULT_WIDTH: number = 250;

	// region Getters / setters

	get skillsPanelWidth(): number {
		return this.DEFAULT_WIDTH;
	}

	// endregion

	getSkillExpertiseColor(skill: Skill) {
		return this.SKILL_EXPERTISE_COLOR[skill.expertise];
	}

}
