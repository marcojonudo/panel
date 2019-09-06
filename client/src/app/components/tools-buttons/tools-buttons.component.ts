import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TimeService} from "../../services/time.service";
import {DaysService} from "../../services/days.service";

@Component({
	selector: 'app-tools-buttons',
	templateUrl: './tools-buttons.component.html',
	styleUrls: ['./tools-buttons.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolsButtonsComponent {

	// private buttons: ToolsButtonInterface[];

	constructor(
		private timeService: TimeService,
		private daysService: DaysService
	) {
		// this.buttons = [
		//   { icon: 'fas fa-arrows-alt-h', action: this.fitTime },
		//   { icon: 'fas fa-binoculars', action: this.toggleView }
		// ];
	}

	fitTime() {
		this.timeService.toggleFitWidth();
	}

	toggleDayMode() {
		this.daysService.toggleDayMode();
	}

	testButtons() {
		console.log('checking test buttons');
	}

}
