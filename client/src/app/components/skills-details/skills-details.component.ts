import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {CommonService} from "../../services/common.service";
import {Skill} from "../../objects/skill";
import {SubscriptionLog} from "rxjs/internal/testing/SubscriptionLog";
import {Subscription} from "rxjs/internal/Subscription";

@Component({
	selector: 'app-skills-details',
	templateUrl: './skills-details.component.html',
	styleUrls: ['./skills-details.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkillsDetailsComponent implements OnInit, OnDestroy {

	private SKILL_EXPERTISE_COLOR: any = {
		LOW: '#FF0000',
		MEDIUM: '#FFFF00',
		HIGH: '#008000'
	};

	private DEFAULT_WIDTH: number = 250;

	private skillsSubscription: Subscription;
	private _skills: Skill[];

	private _showSkills: boolean;

	constructor(
		private commonService: CommonService,
		private cdRef: ChangeDetectorRef
	) {
		this.skills = [];
		this.showSkills = false;
	}

	ngOnInit(): void {
		this.skillsSubscription = this.commonService.skills$.subscribe(skills => {
			if (skills.length) {
				skills.forEach((parent: Skill) => {
					this.skills.push(parent);
					parent.children.forEach((child: Skill) => {
						this.skills.push(child);
					});
				});
			} else {
				this.skills = skills;
			}
			this.showSkills = this.skills.length != 0;
			this.cdRef.detectChanges();
		});
	}

	ngOnDestroy(): void {
		this.skillsSubscription.unsubscribe();
	}

	// region Getters / setters

	get skills(): Skill[] {
		return this._skills;
	}

	set skills(value: Skill[]) {
		this._skills = value;
	}

	get skillsPanelWidth(): number {
		return this.DEFAULT_WIDTH;
	}

	get showSkills(): boolean {
		return this._showSkills;
	}

	set showSkills(value: boolean) {
		this._showSkills = value;
	}

	// endregion

	getSkillExpertiseColor(skill: Skill) {
		return this.SKILL_EXPERTISE_COLOR[skill.expertise];
	}

}
