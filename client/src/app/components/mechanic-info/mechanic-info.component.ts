import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {DaysService} from "../../services/days.service";
import {Constants} from "../../objects/constants";
import {Mechanic} from "../../objects/mechanic";
import {JobLineType} from "../../objects/job-line-type";
import {CommonService} from "../../services/common.service";
import {Skill} from "../../objects/skill";
import {CardsService} from "../../services/cards.service";
import {NgbModal, NgbModalConfig} from "@ng-bootstrap/ng-bootstrap";
import {Subscription} from "rxjs/internal/Subscription";

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

	private skillsSubscription: Subscription;

	private _oneDayMode: boolean;
	private oneDayModeSubscription: Subscription;
	private _highlightMechanic: boolean;
	private _showAppointmentSchedulesDialog: boolean;

	constructor(
		private daysService: DaysService,
		private cardsServie: CardsService,
		private commonService: CommonService,
		private modalService: NgbModal,
		private cdRef: ChangeDetectorRef
	) {
		this.oneDayMode = true;
		this.highlightMechanic = false;
		this.showAppointmentSchedulesDialog = false;
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
		const assignedCardsGroups = this.cardsServie.getAssignedCardsGroups(this.mechanic.day, this.mechanic.code);
		if (assignedCardsGroups.length) {
			this.modalService.open(content, {centered: true}).result.then(
				() => {
					assignedCardsGroups.forEach(group => {
						this.cardsServie.removeFromOrigin(group);
						this.cardsServie.updateTranslatedCards(group)
					});
					this.removeMechanic();
				},
				() => {});
		} else {
			this.removeMechanic();
		}
	}

	removeMechanic() {
		this.daysService.removeMechanic(this.day, this.mechanic);
	}

	toggleAppointmentSchedulesDialog(): void {
		this.showAppointmentSchedulesDialog = !this.showAppointmentSchedulesDialog;
		this.cdRef.detectChanges();
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
