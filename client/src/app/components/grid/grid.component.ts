import {ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, Renderer2} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {Mechanic} from "../../objects/mechanic";
import {MechanicUpdate} from "../../objects/update-days-cards/mechanic-update";
import {Constants} from "../../objects/constants";
import {MechanicsService} from "../../services/mechanics.service";
import {DayMechanicSkills} from "../../objects/skills-update/day-mechanic-skills";
import {NotificationService} from "../../services/notification.service";
import {DayCardDetails} from "../../objects/card-details-update/day-card-details";

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
	@Input() maxScheduleWidth: number;

	private pointerDownListener: () => void;

	constructor(
		private mechanicsService: MechanicsService,
		private element: ElementRef,
		private renderer: Renderer2,
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

	onPointerDown(): void {
		NotificationService.notifyContextMenu(undefined);
		NotificationService.notifyCardDetails(new DayCardDetails(this.day, undefined));
	}

	checkTriggerMechanicLineCd(
		mechanicCode: string,
		mechanicLineUpdate: MechanicUpdate = this.mechanicLineUpdate
	): MechanicUpdate {
		return mechanicLineUpdate && mechanicCode == mechanicLineUpdate.mechanicCode ? mechanicLineUpdate : undefined;
	}

	checkTriggerMechanicInfoCd(
		mechanicCode: string,
		dayMechanicSkills: DayMechanicSkills = this.dayMechanicSkills
	): MechanicUpdate {
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
