import {ChangeDetectionStrategy, Component, Input, OnInit,} from '@angular/core';
import {Constants} from "../../objects/constants";
import {MechanicUpdate} from "../../objects/update-days-cards/mechanic-update";
import {Mechanic} from "../../objects/mechanic";
import {DimensionsService} from "../../services/dimensions.service";
import {HourQuarter} from "../../objects/hour-quarter";
import {Dayjs} from "dayjs";
import {MechanicSkillsUpdate} from "../../objects/trigger-cd/update-objects/mechanic-skills-update";

@Component({
	selector: 'app-day-panel',
	templateUrl: './day-panel.component.html',
	styleUrls: ['./day-panel.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DayPanelComponent implements OnInit {

	@Input() day: Dayjs;
	@Input() mechanics: Mechanic[];
	@Input() saturatedQuarters: HourQuarter[];
	@Input() mechanicLineUpdate: MechanicUpdate;
	@Input() mechanicSkillsUpdate: MechanicSkillsUpdate;
	@Input() showAppointmentsName: boolean;
	@Input() maxScheduleHoursQuarter: HourQuarter[];
	@Input() maxScheduleWidth: number;
	@Input() timeIndicatorLeft: number;

	timeIndicatorHeight: number;

	ngOnInit() {
		this.timeIndicatorHeight = this.mechanics ? DimensionsService.calcGridCompleteHeight(this.mechanics) : 0;
	}

	checkShowTimeIndicator(): boolean {
		return this.timeIndicatorLeft < this.maxScheduleWidth;
	}

	checkDayPanel() {
		if (Constants.CHECK) {
			console.log('checking day panel', this.mechanicLineUpdate);
		}
	}

}
