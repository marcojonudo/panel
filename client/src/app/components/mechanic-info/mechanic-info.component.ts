import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {DaysService} from "../../services/days.service";
import {Constants} from "../../objects/constants";
import {Mechanic} from "../../objects/mechanic";
import {JobLineType} from "../../objects/job-line-type";
import {CommonService} from "../../services/common.service";
import {Skill} from "../../objects/skill";
import {CardsService} from "../../services/cards.service";

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

	private skillsSubscription: any;

	private _oneDayMode: boolean;
	private oneDayModeSubscription: any;
	private _highlightMechanic: boolean;

	constructor(
		private daysService: DaysService,
		private cardsServie: CardsService,
		private commonService: CommonService,
		private cdRef: ChangeDetectorRef
	) {
		this.oneDayMode = true;
		this.highlightMechanic = false;
	}

	ngOnInit(): void {
		this.oneDayModeSubscription = this.daysService.oneDayMode$.subscribe(oneDayMode => {
			// TODO Añadir detectChanges
			this.oneDayMode = oneDayMode;
		});
		this.skillsSubscription = this.commonService.skills$.subscribe(skills => {
			if (!(skills.length && this.mechanic.skills == skills)) {
				this.highlightMechanic = false;
				this.cdRef.detectChanges();
			}
		});
	}

	ngOnDestroy(): void {
		this.oneDayModeSubscription.unsubscribe();
		this.skillsSubscription.unsubscribe();
	}

	// region Getters / setters

	get oneDayMode(): boolean {
		return this._oneDayMode;
	}

	set oneDayMode(value: boolean) {
		this._oneDayMode = value;
	}

	get highlightMechanic(): boolean {
		return this._highlightMechanic;
	}

	set highlightMechanic(value: boolean) {
		this._highlightMechanic = value;
	}

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

	checkRemoveMechanic(): boolean {
		return this.cardsServie.getAssignedCards(this.mechanic.day, this.mechanic.code).length == 0;
	}

	removeMechanic() {
		this.daysService.removeMechanic(this.day, this.mechanic);
	}

	showSkills(skills: Skill[]) {
		this.highlightMechanic = !this.highlightMechanic;
		this.commonService.emitSkills(this.highlightMechanic ? skills : []);
		this.cdRef.detectChanges();
	}

	check() {
		if (Constants.CHECK) {
			console.log('checking mechanic info')
		}
	}

}
