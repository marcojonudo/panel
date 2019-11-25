import {Component, Input,} from '@angular/core';
import {Constants} from "../../objects/constants";

@Component({
	selector: 'app-day-panel',
	templateUrl: './day-panel.component.html',
	styleUrls: ['./day-panel.component.css']
})
export class DayPanelComponent {

	@Input() day: Date;
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
