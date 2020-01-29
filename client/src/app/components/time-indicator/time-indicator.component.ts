import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Constants} from "../../objects/constants";

@Component({
	selector: 'app-time-indicator',
	templateUrl: './time-indicator.component.html',
	styleUrls: ['./time-indicator.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeIndicatorComponent {

	@Input() left: number;
	@Input() height: number;

	checkShow(): boolean {
		return this.left != undefined;
	}

	check(): void {
		if (Constants.CHECK) {
			console.log('checking time indicator component', this.left);
		}
	}

}
