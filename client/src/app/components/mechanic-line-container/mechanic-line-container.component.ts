import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Mechanic} from "../../objects/mechanic";

@Component({
	selector: 'app-mechanic-line-container',
	templateUrl: './mechanic-line-container.component.html',
	styleUrls: ['./mechanic-line-container.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MechanicLineContainerComponent {

	@Input() mechanic: Mechanic;
	// @Input() cards: any[];
	@Input() day: Date;
	@Input() maxScheduleHours: number[];

	check() {
		console.log('checking mechanic line container', this.mechanic, this.day)
	}
}
