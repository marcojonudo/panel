import {ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, Renderer2} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {Mechanic} from "../../objects/mechanic";
import {MechanicUpdate} from "../../objects/update-days-cards/mechanic-update";
import {Constants} from "../../objects/constants";
import {MechanicsService} from "../../services/mechanics.service";
import {DayMechanicSkills} from "../../objects/skills-update/day-mechanic-skills";
import {NotificationService} from "../../services/notification.service";
import {DayLateralPanelInfo} from "../../objects/lateral-panel-info/day-lateral-panel-info";
import {CardsService} from "../../services/cards.service";
import {SkillsDetailsInfo} from "../../objects/lateral-panel-info/skills-details-info";
import {MechanicSkills} from "../../objects/mechanic-skills";

@Component({
	selector: 'app-grid',
	templateUrl: './grid.component.html',
	styleUrls: ['./grid.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridComponent implements OnInit {

	@Input() day: Date;
	@Input() mechanics: Mechanic[];
	@Input() mechanicLineUpdate: MechanicUpdate;
	@Input() dayMechanicSkills: DayMechanicSkills;
	@Input() showAppointmentsName: boolean;

	private pointerDownListener: () => void;

	constructor(
		private mechanicsService: MechanicsService,
		private cardsService: CardsService,
		private element: ElementRef,
		private renderer: Renderer2
	) {}

	ngOnInit(): void {
		this.pointerDownListener = this.renderer.listen(
			this.element.nativeElement,
			Constants.EVENT.POINTER_DOWN,
			this.onPointerDown.bind(this)
		);
	}

	// region Getters / setters

	get mechanicBottomMargin(): number {
		return Constants.VALUE.MECHANIC_BOTTOM_MARGIN;
	}

	// endregion

	onPointerDown(event: PointerEvent): void {
		if ((<HTMLElement> event.target).id == Constants.ID.MECHANIC_LINE) {
			NotificationService.notifyContextMenu(undefined);
			NotificationService.notifyLateralInfo(
				new DayLateralPanelInfo(
					this.day,
					new SkillsDetailsInfo(
						new MechanicSkills(
							this.dayMechanicSkills.mechanicCode,
							[]
						)
					)
				)
			);
			if (CardsService.auxiliaryGroupToReplace) {
				this.cardsService.updateCardMode(this.cardsService.unassignedCardsGroups, Constants.GROUP_MODE.DRAG);
			}
		}
	}

	checkTriggerMechanicLineCd(
		mechanicCode: string,
		mechanicLineUpdate: MechanicUpdate = this.mechanicLineUpdate
	): MechanicUpdate {
		return mechanicLineUpdate
			&& (mechanicLineUpdate.mechanicCode == mechanicCode
				|| mechanicLineUpdate.type == Constants.MECHANIC_LINE_UPDATE_TYPE.MAX_SCHEDULE_WIDTH)
			? mechanicLineUpdate : undefined;
	}

	checkTriggerMechanicInfoCd(
		mechanicCode: string,
		dayMechanicSkills: DayMechanicSkills = this.dayMechanicSkills
	): DayMechanicSkills {
		return dayMechanicSkills && mechanicCode == dayMechanicSkills.mechanicCode ? dayMechanicSkills : undefined;
	}

	drop(event: CdkDragDrop<string[]>) {
		moveItemInArray(this.mechanics, event.previousIndex, event.currentIndex);
	}

	check() {
		if (Constants.CHECK) {
			console.log('checking grid', this.mechanicLineUpdate, this.day);
		}
	}

}
