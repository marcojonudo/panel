import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CommonService} from "../../services/common.service";
import {Skill} from "../../objects/skill";

@Component({
	selector: 'app-skills-details',
	templateUrl: './skills-details.component.html',
	styleUrls: ['./skills-details.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkillsDetailsComponent implements OnInit {

	private SKILL_EXPERTISE_COLOR: any = {
		LOW: '#FF0000',
		MEDIUM: '#FFFF00',
		HIGH: '#008000'
	};

	private DEFAULT_WIDTH: number = 250;

	private skillsSubscription: any;
	private _skills: Skill[];
	private _skillsPanelWidth: number;

	constructor(
		private commonService: CommonService,
		private cdRef: ChangeDetectorRef
	) {
		this.skillsPanelWidth = 0;
	}

	ngOnInit() {
		this.skillsSubscription = this.commonService.skills$.subscribe(skills => {
			this.skills = skills;
			this.skillsPanelWidth = this.skills.length ? this.DEFAULT_WIDTH : 0;
			this.cdRef.detectChanges();
		});
	}

	// region Getters / setters

	get skills(): Skill[] {
		return this._skills;
	}

	set skills(value: Skill[]) {
		this._skills = value;
	}

	get skillsPanelWidth(): number {
		return this._skillsPanelWidth;
	}

	set skillsPanelWidth(value: number) {
		this._skillsPanelWidth = value;
	}

	// endregion

	getSkillExpertiseColor(skill: Skill) {
		return this.SKILL_EXPERTISE_COLOR[skill.expertise];
	}

}
