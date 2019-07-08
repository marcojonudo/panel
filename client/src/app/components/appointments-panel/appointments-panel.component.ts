import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
	selector: 'app-appointments-panel',
	templateUrl: './appointments-panel.component.html',
	styleUrls: ['./appointments-panel.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppointmentsPanelComponent implements OnInit {

	constructor() {
	}

	ngOnInit() {
	}

}
