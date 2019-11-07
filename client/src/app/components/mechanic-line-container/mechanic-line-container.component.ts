import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Mechanic} from "../../objects/mechanic";
import {Constants} from "../../objects/constants";

@Component({
	selector: 'app-mechanic-line-container',
	templateUrl: './mechanic-line-container.component.html',
	styleUrls: ['./mechanic-line-container.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MechanicLineContainerComponent {

	@Input() mechanic: Mechanic;
	@Input() height: number;
	@Input() position: string;
	// @Input() cards: any[];
	@Input() day: Date;
	@Input() maxScheduleHours: number[];
	@Input() maxScheduleWidth: number;

	// region Getters / setters

	get mechanicInfoWidth() {
		return Constants.VALUE.MECHANIC_INFO_WIDTH;
	}

	// endregion

	check() {
		if (Constants.CHECK) {
			console.log('checking mechanic line container', this.mechanic, this.day)
		}
	}
}
