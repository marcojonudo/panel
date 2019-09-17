import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {DaysService} from "../../services/days.service";

@Component({
	selector: 'app-tools-bar',
	templateUrl: './tools-bar.component.html',
	styleUrls: ['./tools-bar.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolsBarComponent {

	private readonly TOOLS_BAR_WIDTH: number = 30;

	private show: boolean;
	private toolsBarWidth: number;

	constructor(
		private daysService: DaysService,
		private cdRef: ChangeDetectorRef
	) {
		this.show = true;
	}

	toggleToolsBar(): void {
		this.show = !this.show;
		this.toolsBarWidth = this.show ? this.TOOLS_BAR_WIDTH : 0;
		this.cdRef.detectChanges();
	}

	toggleDayMode(): void {
		this.daysService.toggleDayMode();
	}

}
