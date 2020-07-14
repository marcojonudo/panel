import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {Constants} from "../../objects/constants";
import {Mechanic} from "../../objects/mechanic";
import {JobLineType} from "../../objects/job-line-type";
import {Skill} from "../../objects/skill";
import {CardsService} from "../../services/cards.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {MechanicsService} from "../../services/mechanics.service";
import {NotificationService} from "../../services/notification.service";
import {JobLineTypeService} from "../../services/job-line-type.service";
import {Dayjs} from "dayjs";

@Component({
	selector: 'app-mechanic-info',
	templateUrl: './mechanic-info.component.html',
	styleUrls: ['./mechanic-info.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MechanicInfoComponent {

	@Input() day: Dayjs;
	@Input() mechanic: Mechanic;
	@Input() jobLineType: string;
	@Input() position: string;
	@Input() highlight: boolean;

	private _oneDayMode: boolean;
	private _showAppointmentSchedulesDialog: boolean;

	constructor(
		private mechanicsService: MechanicsService,
		private cardsService: CardsService,
		private jobLineTypeService: JobLineTypeService,
		private modalService: NgbModal,
		private cdRef: ChangeDetectorRef
	) {
		this.oneDayMode = true;
		this.showAppointmentSchedulesDialog = false;
	}

	// region Getters / setters

	get oneDayMode(): boolean {
		return this._oneDayMode;
	}

	set oneDayMode(value: boolean) {
		this._oneDayMode = value;
	}

	get jobLineTypes(): JobLineType[] {
		return JobLineTypeService.jobLineTypes;
	}

	get defaultHeight() {
		return Constants.VALUE.LINE_HEIGHT_DEFAULT * 2 + Constants.VALUE.JOB_LINE_TYPE_HEIGHT;
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
		const assignedCardsGroups = CardsService.findDayMechanicGroups(this.mechanic.day, this.mechanic.code);
		if (assignedCardsGroups.length) {
			this.modalService.open(content, {centered: true}).result.then(
				() => {
					let resetCards = [];
					assignedCardsGroups.forEach(group => {
						CardsService.removeFromAssigned(group, this.day, this.mechanic.code);
						CardsService.resetCardsGroup(group);
						resetCards = resetCards.concat(group.cards);
						CardsService.addToUnassigned(group);
					});
					this.cardsService.updateDbCardsPosition(resetCards);
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

	showSkills(
		skills: Skill[],
		day: Dayjs,
		mechanicCode: string,
		highlight: boolean = this.highlight
	) {
		NotificationService.notifyDayMechanicSkills(day, mechanicCode, highlight ? undefined : skills);
	}

	findJobLineTypeBackgroundColor(code: string): string {
		return JobLineTypeService.findJobLineTypeColor(code);
	}

	findJobLineTypeColor(code: string): string {
		return code == Constants.JOB_LINE_TYPE.AA ? Constants.COLOR.WHITE : Constants.COLOR.BLACK;
	}

	updateJobLineType(mechanic: Mechanic = this.mechanic): void {
		this.jobLineTypeService.updateDbJobLineType(mechanic);
		NotificationService.notifyMechanicLine(mechanic.day, mechanic.code);
		this.cdRef.detectChanges();
	}

	check() {
		if (Constants.CHECK) {
			console.log('checking mechanic info')
		}
	}

}
