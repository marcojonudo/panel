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
export class GridComponent implements OnInit, OnDestroy {

	@Input() day: Date;
	@Input() dayCardUpdate: MechanicLineUpdate;
	@Input() maxScheduleHours: number[];
	@Input() maxScheduleWidth: number;

	private _mechanics: Mechanic[];

	private mechanicsSubscription: Subscription;

	constructor(
		private daysService: DaysService,
		private cdRef: ChangeDetectorRef
	) {}

	ngOnInit(): void {
		this.mechanics = this.daysService.daysMechanics[this.day.getTime()];
	}

	ngOnDestroy(): void {
		this.mechanicsSubscription.unsubscribe();
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
		dayCardUpdate: MechanicLineUpdate = this.dayCardUpdate
	): MechanicLineUpdate {
		return dayCardUpdate && mechanicCode == dayCardUpdate.mechanicCode ? dayCardUpdate : undefined;
	}

	drop(event: CdkDragDrop<string[]>) {
		moveItemInArray(this.mechanics, event.previousIndex, event.currentIndex);
	}

	get lineHeight$() {
		return this.daysService.lineHeight$;
	}

	check() {
		if (Constants.CHECK) {
			console.log('checking grid', this.dayCardUpdate);
		}
	}

}
