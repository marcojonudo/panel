import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {Mechanic} from "../../objects/mechanic";
import {MechanicLineUpdate} from "../../objects/update-days-cards/mechanic-line-update";
import {Constants} from "../../objects/constants";
import {MechanicsService} from "../../services/mechanics.service";

@Component({
	selector: 'app-grid',
	templateUrl: './grid.component.html',
	styleUrls: ['./grid.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridComponent implements OnInit {

	@Input() day: Date;
	@Input() mechanicLineUpdate: MechanicLineUpdate;

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

	private checkTriggerMechanicCd(
		mechanicCode: string,
		mechanicLineUpdate: MechanicLineUpdate = this.mechanicLineUpdate
	): MechanicLineUpdate {
		return mechanicLineUpdate && mechanicCode == mechanicLineUpdate.mechanicCode ? mechanicLineUpdate : undefined;
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
