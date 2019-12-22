import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {Mechanic} from "../../objects/mechanic";
import {MechanicUpdate} from "../../objects/update-days-cards/mechanic-update";
import {Constants} from "../../objects/constants";
import {MechanicsService} from "../../services/mechanics.service";
import {DayMechanicSkills} from "../../objects/skills-update/day-mechanic-skills";

@Component({
	selector: 'app-grid',
	templateUrl: './grid.component.html',
	styleUrls: ['./grid.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridComponent implements OnInit {

	@Input() day: Date;
	@Input() mechanicLineUpdate: MechanicUpdate;
	@Input() dayMechanicSkills: DayMechanicSkills;
	@Input() maxScheduleWidth: number;

	private _mechanics: Mechanic[];

	constructor(
		private mechanicsService: MechanicsService
	) {}

	ngOnInit(): void {
		this.mechanics = this.mechanicsService.findDayMechanics(this.day);
	}

	// region Getters / setters

	get mechanics(): Mechanic[] {
		return this._mechanics;
	}

	set mechanics(value: Mechanic[]) {
		this._mechanics = value;
	}

	get mechanicBottomMargin(): number {
		return Constants.VALUE.MECHANIC_BOTTOM_MARGIN;
	}

	// endregion

	private checkTriggerMechanicLineCd(
		mechanicCode: string,
		mechanicLineUpdate: MechanicUpdate = this.mechanicLineUpdate
	): MechanicUpdate {
		return mechanicLineUpdate && mechanicCode == mechanicLineUpdate.mechanicCode ? mechanicLineUpdate : undefined;
	}

	private checkTriggerMechanicInfoCd(
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
