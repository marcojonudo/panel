import {ChangeDetectionStrategy, Component, Input,} from '@angular/core';
import {Constants} from "../../objects/constants";
import {DayCardUpdate} from "../../objects/update-days-cards/day-card-update";

@Component({
	selector: 'app-day-panel',
	templateUrl: './day-panel.component.html',
	styleUrls: ['./day-panel.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DayPanelComponent {

	@Input() day: Date;
	@Input() dayCardUpdate: DayCardUpdate;
	@Input() dayCardsGroups: any;
	@Input() maxScheduleHours: number[];
	@Input() maxScheduleWidth: number;

	constructor() { }

	checkDayPanel() {
		if (Constants.CHECK) {
			console.log('checking day panel', this.day, this.dayCardsGroups);
		}
	}

}
