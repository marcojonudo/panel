import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit} from '@angular/core';
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
		private daysService: DaysService
	) {
	}

	ngOnInit(): void {
		// this.mechanicsSubscription = this.daysService.daysMechanics$[this.day.getTime()].subscribe(mechanics => {
		// 	this.mechanics = mechanics;
		// });
	}

	ngOnDestroy(): void {
		// this.mechanicasSubscription.unsubscribe();
	}

	get mechanics(): Mechanic[] {
		return this.daysService.daysMechanics$[this.day.getTime()];
	}

	set mechanics(value: Mechanic[]) {
		this._mechanics = value;
	}

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
