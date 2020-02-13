import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Constants} from "../../objects/constants";
import {DimensionsService} from "../../services/dimensions.service";

@Component({
	selector: 'app-time-indicator',
	templateUrl: './time-indicator.component.html',
	styleUrls: ['./time-indicator.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeIndicatorComponent {

	@Input() height: number;

	left: number;

	constructor() {
		this.left = DimensionsService.calcLeftFromStart(new Date()) + Constants.VALUE.MECHANIC_INFO_WIDTH;
	}

	check(): void {
		if (Constants.CHECK) {
			console.log('checking time indicator component', this.left);
		}
	}

}
