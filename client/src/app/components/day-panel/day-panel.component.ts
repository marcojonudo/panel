import {ChangeDetectionStrategy, Component, Input,} from '@angular/core';
import {Constants} from "../../objects/constants";
import {MechanicUpdate} from "../../objects/update-days-cards/mechanic-update";
import {DayMechanicSkills} from "../../objects/skills-update/day-mechanic-skills";
import {QuartersSaturation} from "../../objects/quarters-saturation";
import {ContextMenuInfo} from "../../objects/context-menu-info";
import {Mechanic} from "../../objects/mechanic";

@Component({
	selector: 'app-day-panel',
	templateUrl: './day-panel.component.html',
	styleUrls: ['./day-panel.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DayPanelComponent {

	@Input() day: Date;
	@Input() mechanics: Mechanic[];
	@Input() quartersSaturation: QuartersSaturation;
	@Input() mechanicLineUpdate: MechanicUpdate;
	@Input() dayMechanicSkills: DayMechanicSkills;
	@Input() contextMenuInfo: ContextMenuInfo;
	@Input() showAppointmentsName: boolean;
	@Input() maxScheduleHours: number[];
	@Input() maxScheduleWidth: number;

	checkShowContextMenu(contextMenuInfo: ContextMenuInfo = this.contextMenuInfo): boolean {
		return contextMenuInfo != undefined;
	}

	checkDayPanel() {
		if (Constants.CHECK) {
			console.log('checking day panel', this.mechanicLineUpdate);
		}
	}

}
