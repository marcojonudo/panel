import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Constants} from "../../objects/constants";
import {Mechanic} from "../../objects/mechanic";
import {JobLineType} from "../../objects/job-line-type";
import {CommonService} from "../../services/common.service";
import {Skill} from "../../objects/skill";
import {CardsService} from "../../services/cards.service";
import {NgbModal, NgbModalConfig} from "@ng-bootstrap/ng-bootstrap";
import {Subscription} from "rxjs/internal/Subscription";
import {MechanicsService} from "../../services/mechanics.service";
import {NotificationService} from "../../services/notification.service";
import {DayMechanicSkills} from "../../objects/skills-update/day-mechanic-skills";
import {MechanicUpdate} from "../../objects/update-days-cards/mechanic-update";

@Component({
	selector: 'app-mechanic-info',
	templateUrl: './mechanic-info.component.html',
	styleUrls: ['./mechanic-info.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MechanicInfoComponent {

	@Input() day: Date;
	@Input() mechanic: Mechanic;
	@Input() position: string;
	@Input() dayMechanicSkills: DayMechanicSkills;

	private _oneDayMode: boolean;
	private _highlightMechanic: boolean;
	private _showAppointmentSchedulesDialog: boolean;

	constructor(
		private mechanicsService: MechanicsService,
		private cardsService: CardsService,
		private commonService: CommonService,
		private modalService: NgbModal,
		private cdRef: ChangeDetectorRef
	) {
		this.oneDayMode = true;
		this.highlightMechanic = false;
		this.showAppointmentSchedulesDialog = false;
	}

	// ngOnInit(): void {
	// 	// this.oneDayModeSubscription = this.daysService.oneDayMode$.subscribe(oneDayMode => {
	// 	// 	// TODO Añadir detectChanges
	// 	// 	this.oneDayMode = oneDayMode;
	// 	// });
	// 	this.skillsSubscription = this.commonService.skills$.subscribe(skills => {
	// 		if (!(skills.length && this.mechanic.skills == skills)) {
	// 			this.highlightMechanic = false;
	// 			this.cdRef.detectChanges();
	// 		}
	// 	});
	// }

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

	get mechanicInfoWidth() {
		return Constants.VALUE.MECHANIC_INFO_WIDTH;
	}

	get showAppointmentSchedulesDialog(): boolean {
		return this._showAppointmentSchedulesDialog;
	}

	set showAppointmentSchedulesDialog(value: boolean) {
		this._showAppointmentSchedulesDialog = value;
	}

	// endregion

	getSkillColorObject(skill: Skill): any {
		return skill.expertise && skill.expertise != Constants.SKILL_EXPERTISE_LEVEL.LOW ?
			{'background-color': skill.backgroundColor, 'color': skill.color} : undefined;
	}

	checkRemoveMechanic(content): void {
		const assignedCardsGroups = this.cardsService.findDayMechanicGroups(this.mechanic.day, this.mechanic.code);
		if (assignedCardsGroups.length) {
			this.modalService.open(content, {centered: true}).result.then(
				() => {
					assignedCardsGroups.forEach(group => {
						this.cardsService.removeFromAssigned(group, this.day, this.mechanic.code);
						this.cardsService.resetCardsGroup(group);
						this.cardsService.addToUnassigned(group);
					});
					this.mechanicsService.removeMechanic(this.day, this.mechanic);
				},
				() => {});
		} else {
			this.mechanicsService.removeMechanic(this.day, this.mechanic);
		}
	}

	toggleAppointmentSchedulesDialog(): void {
		this.showAppointmentSchedulesDialog = !this.showAppointmentSchedulesDialog;
		this.cdRef.detectChanges();
	}

	checkHighlightMechanic(
		dayMechanicSkills: DayMechanicSkills = this.dayMechanicSkills
	): boolean {
		return dayMechanicSkills && dayMechanicSkills.skills.length != 0;
	}

	showSkills(
		skills: Skill[],
		day: Date,
		mechanicCode: string,
		dayMechanicSkills: DayMechanicSkills = this.dayMechanicSkills
	) {
		NotificationService.notifySkills(
			new DayMechanicSkills(day, mechanicCode, dayMechanicSkills && dayMechanicSkills.skills.length ? [] : skills)
		);
	}

	check() {
		if (Constants.CHECK) {
			console.log('checking mechanic info')
		}
	}

}
