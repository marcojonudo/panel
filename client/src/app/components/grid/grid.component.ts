import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {DaysService} from "../../services/days.service";
import {Mechanic} from "../../objects/mechanic";
import {Subscription} from "rxjs/internal/Subscription";
import {MechanicLineUpdate} from "../../objects/update-days-cards/mechanic-line-update";
import {Constants} from "../../objects/constants";

@Component({
	selector: 'app-grid',
	templateUrl: './grid.component.html',
	styleUrls: ['./grid.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridComponent implements OnInit {

	@Input() day: Date;
	@Input() mechanicLineUpdate: MechanicLineUpdate;
	@Input() maxScheduleHours: number[];
	@Input() maxScheduleWidth: number;

	private _mechanics: Mechanic[];

	constructor(
		private daysService: DaysService
	) {}

	ngOnInit(): void {
		this.mechanics = this.daysService.daysMechanics[this.day.getTime()];
	}

	// region Getters / setters

	get mechanics(): Mechanic[] {
		return this._mechanics;
	}

	set mechanics(value: Mechanic[]) {
		this._mechanics = value;
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

	get lineHeight$() {
		return this.daysService.lineHeight$;
	}

	check() {
		if (Constants.CHECK) {
			console.log('checking grid', this.mechanicLineUpdate, this.day);
		}
	}

}
