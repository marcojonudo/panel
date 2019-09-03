import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {TimeService} from "../../services/time.service";
import {DaysService} from "../../services/days.service";

@Component({
	selector: 'app-main',
	templateUrl: './main.component.html',
	styleUrls: ['./main.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent implements AfterViewInit {

	private _days: Date[];
	private itemSize: number;

	private relativeContainer: boolean;
	private scrollLeft: number;
	private scrollTop: number;
	// private _scrollLeft: number;

	// private clickedCardSubject;
	// private clickedCard$: Observable<boolean>;
	// private startPosition;

	// private unassignedCardsDays: any;
	// private assignedCards: any[];
	// private testList: any[];

	// private position: any;

	// private hide: boolean;

	@ViewChild('schedulesContainer', {static: true}) schedulesContainer: ElementRef;

	constructor(
		private daysService: DaysService,
		private timeService: TimeService
	) {
		this.days = this.daysService.days;
		// this.itemSize = this.mechanicsService.mechanics.length * (Constants.VALUE.LINE_HEIGHT_DEFAULT + 10);

		this.relativeContainer = true;
		this.scrollLeft = 0;
		this.scrollTop = 0;
	}

	ngAfterViewInit(): void {
		this.timeService.dropzoneWidth = this.schedulesContainer.nativeElement.offsetWidth - 180;
	}

	// region Getters / setters

	get days(): Date[] {
		return this._days;
	}

	set days(value: Date[]) {
		this._days = value;
	}

	// endregion

	get oneDayMode$() {
		return this.daysService.oneDayMode$;
	}

	get percentageWidth$() {
		return this.timeService.percentageWidth$
	}

	trackByDay(index, item) {
		return item
	}

	check() {
		console.log('checking main');
	}

}
