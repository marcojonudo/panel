import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {DaysService} from "../../services/days.service";
import {Constants} from "../../objects/constants";
import {Mechanic} from "../../objects/mechanic";
import {JobLineType} from "../../objects/job-line-type";
import {CommonService} from "../../services/common.service";
import {Skill} from "../../objects/skill";

@Component({
	selector: 'app-mechanic-info',
	templateUrl: './mechanic-info.component.html',
	styleUrls: ['./mechanic-info.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MechanicInfoComponent implements OnInit, OnDestroy {

	@Input() day: Date;
	@Input() mechanic: Mechanic;
	@Input() position: string;

	private oneDayMode: boolean;
	private oneDayModeSubscription: any;

	constructor(
		private daysService: DaysService,
		private commonService: CommonService
	) {
		this.oneDayMode = true;
	}

	ngOnInit(): void {
		this.oneDayModeSubscription = this.daysService.oneDayMode$.subscribe(oneDayMode => {
			// TODO Añadir detectChanges
			this.oneDayMode = oneDayMode;
		})
	}

	ngOnDestroy(): void {
		this.oneDayModeSubscription.unsubscribe();
	}

	// region Getters / setters

	get jobLineTypes(): JobLineType[] {
		return this.commonService.jobLineTypes;
	}

	get defaultHeight() {
		return Constants.VALUE.LINE_HEIGHT_DEFAULT * 2;
	}

	// endregion

	getSkillColorObject(skill: Skill): any {
		return skill.expertise && skill.expertise != Constants.SKILL_EXPERTISE_LEVEL.LOW ?
			{'background-color': skill.backgroundColor, 'color': skill.color} : undefined;
	}

	removeMechanic(position: string) {
		this.daysService.removeMechanic(this.day, position);
	}

	test(type: string) {
		console.log('test', type);
	}

	check() {
		if (Constants.CHECK) {
			console.log('checking mechanic info')
		}
	}

}
