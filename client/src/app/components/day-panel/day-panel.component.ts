import {ChangeDetectionStrategy, Component, Input,} from '@angular/core';
import {Constants} from "../../objects/constants";
import {MechanicUpdate} from "../../objects/update-days-cards/mechanic-update";
import {DayMechanicSkills} from "../../objects/skills-update/day-mechanic-skills";
import {QuartersSaturation} from "../../objects/quarters-saturation";

@Component({
	selector: 'app-day-panel',
	templateUrl: './day-panel.component.html',
	styleUrls: ['./day-panel.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DayPanelComponent {

	@Input() day: Date;
	@Input() quartersSaturation: QuartersSaturation;
	@Input() mechanicLineUpdate: MechanicUpdate;
	@Input() dayMechanicSkills: DayMechanicSkills;
	@Input() maxScheduleHours: number[];
	@Input() maxScheduleWidth: number;

	checkDayPanel() {
		if (Constants.CHECK) {
			console.log('checking day panel', this.mechanicLineUpdate);
		}
	}

}
