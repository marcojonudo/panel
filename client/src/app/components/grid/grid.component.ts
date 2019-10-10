import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {DaysService} from "../../services/days.service";
import {Mechanic} from "../../objects/mechanic";
import {Constants} from "../../objects/constants";

@Component({
	selector: 'app-grid',
	templateUrl: './grid.component.html',
	styleUrls: ['./grid.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridComponent implements OnInit, OnDestroy {

	@Input() day: Date;
	@Input() maxScheduleHours: number[];

	private _mechanics: Mechanic[];

	private mechanicsSubscription: any;

	constructor(
		private daysService: DaysService,
		private cdRef: ChangeDetectorRef
	) {}

	ngOnInit(): void {
		this.mechanics = this.daysService.daysMechanics[this.day.getTime()];
		this.mechanicsSubscription = this.daysService.daysMechanics$[this.day.getTime()].subscribe(mechanics => {
			const removedMechanicIndex = this.mechanics.findIndex(mechanic =>
				!mechanics.find(m => m.panelPosition == mechanic.panelPosition)
			);
			let prevPosition = this.mechanics[removedMechanicIndex].panelPosition;
			this.mechanics.splice(removedMechanicIndex, 1);

			for (let i = removedMechanicIndex; i < this.mechanics.length; i++) {
				const newPosition = this.mechanics[i].panelPosition;
				this.mechanics[i].panelPosition = prevPosition;
				prevPosition = newPosition;
			}
			this.cdRef.detectChanges();
		});
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

	drop(event: CdkDragDrop<string[]>) {
		moveItemInArray(this.mechanics, event.previousIndex, event.currentIndex);
	}

	get lineHeight$() {
		return this.daysService.lineHeight$;
	}

	check() {
		if (Constants.CHECK) {
			console.log('checking grid');
		}
	}

}
