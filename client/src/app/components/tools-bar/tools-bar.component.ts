import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {DaysService} from "../../services/days.service";
import {Constants} from "../../objects/constants";

@Component({
	selector: 'app-tools-bar',
	templateUrl: './tools-bar.component.html',
	styleUrls: ['./tools-bar.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolsBarComponent {

	constructor(
		private daysService: DaysService
	) {}

	// region Getters / setters

	get toolsBarWidth(): number {
		return Constants.VALUE.TOOLS_BAR_WIDTH;
	}

	// endregion

	toggleDayMode(): void {
		this.daysService.toggleDayMode();
	}

}
