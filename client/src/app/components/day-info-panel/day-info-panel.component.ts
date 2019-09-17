import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Constants} from "../../objects/constants";

@Component({
	selector: 'app-day-info-panel',
	templateUrl: './day-info-panel.component.html',
	styleUrls: ['./day-info-panel.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DayInfoPanelComponent implements OnInit {

	constructor() {
	}

	ngOnInit() {
	}

	checkDayInfoPanel() {
		if (Constants.CHECK) {
			console.log('checking tools');
		}
	}
}
