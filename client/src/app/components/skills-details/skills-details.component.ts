import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	EventEmitter,
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
export class SkillsDetailsComponent implements OnInit, OnDestroy {

	private SKILL_EXPERTISE_COLOR: any = {
		LOW: '#FF0000',
		MEDIUM: '#FFFF00',
		HIGH: '#008000'
	};

	private DEFAULT_WIDTH: number = 250;

	@Output() showSkills: EventEmitter<boolean>;

	private skillsSubscription: Subscription;
	private _skills: Skill[];

	constructor(
		private commonService: CommonService,
		private cdRef: ChangeDetectorRef
	) {
		this.skills = [];
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
			this.showSkills.emit(this.skills.length != 0);
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

	// endregion

	getSkillExpertiseColor(skill: Skill) {
		return this.SKILL_EXPERTISE_COLOR[skill.expertise];
	}

}
