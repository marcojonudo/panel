import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {DaysService} from "../../services/days.service";
import {Mechanic} from "../../objects/mechanic";
import {Constants} from "../../objects/constants";
import {Subscription} from "rxjs/internal/Subscription";
import {MechanicUpdate} from "../../objects/mechanic-update/mechanic-update";
import {CardsGroup} from "../../objects/cards-group";

@Component({
	selector: 'app-grid',
	templateUrl: './grid.component.html',
	styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit, OnDestroy {

	@Input() day: Date;
	@Input() dayCardsGroups: any;
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
		this.mechanicsSubscription = this.daysService.daysMechanics$[this.day.getTime()]
			.subscribe((mechanicUpdate: MechanicUpdate) => {
				mechanicUpdate.update(this.mechanics);
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

	findMechanicCardsGroups(mechanicCode): CardsGroup {
		return this.dayCardsGroups[mechanicCode];
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
