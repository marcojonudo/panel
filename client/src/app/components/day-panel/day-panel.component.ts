import {ChangeDetectionStrategy, Component, Input,} from '@angular/core';
import {Constants} from "../../objects/constants";
import {MechanicLineUpdate} from "../../objects/update-days-cards/mechanic-line-update";

@Component({
	selector: 'app-day-panel',
	templateUrl: './day-panel.component.html',
	styleUrls: ['./day-panel.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DayPanelComponent {

	@Input() day: Date;
	@Input() dayCardUpdate: MechanicLineUpdate;
	@Input() maxScheduleHours: number[];
	@Input() maxScheduleWidth: number;

	constructor() { }

	checkDayPanel() {
		if (Constants.CHECK) {
			console.log('checking day panel', this.dayCardUpdate);
		}
	}

}
