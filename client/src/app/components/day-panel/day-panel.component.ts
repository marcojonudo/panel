import {ChangeDetectionStrategy, Component, Input,} from '@angular/core';
import {TimeService} from "../../services/time.service";
import {DaysService} from "../../services/days.service";

@Component({
	selector: 'app-day-panel',
	templateUrl: './day-panel.component.html',
	styleUrls: ['./day-panel.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DayPanelComponent {

	@Input() index: number;
	// @Input() dayCards: any[];
	@Input() day: string;

	constructor(
		private timeService: TimeService,
		private daysService: DaysService
	) {
	}

	get oneDayMode$() {
		return this.daysService.oneDayMode$;
	}

	checkDayPanel() {
		console.log('checking day panel');
	}

}
