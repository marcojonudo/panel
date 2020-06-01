import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Constants} from "../../objects/constants";
import {Dayjs} from "dayjs";

@Component({
	selector: 'app-day-info-panel',
	templateUrl: './day-info-panel.component.html',
	styleUrls: ['./day-info-panel.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DayInfoPanelComponent {

	@Input() day: Dayjs;

	checkDayInfoPanel() {
		if (Constants.CHECK) {
			console.log('checking tools');
		}
	}
}
