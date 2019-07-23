import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
	selector: 'app-mechanic-line-container',
	templateUrl: './mechanic-line-container.component.html',
	styleUrls: ['./mechanic-line-container.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MechanicLineContainerComponent {

	@Input() mechanic: string;
	// @Input() cards: any[];
	@Input() day: Date;

	check() {
		console.log('checking mechanic line container', this.mechanic, this.day)
	}
}
