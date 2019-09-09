import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Constants} from "../../objects/constants";

@Component({
	selector: 'app-tools-panel',
	templateUrl: './tools-panel.component.html',
	styleUrls: ['./tools-panel.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolsPanelComponent implements OnInit {

	constructor() {
	}

	ngOnInit() {
	}

	checkToolsPanel() {
		if (Constants.CHECK) {
			console.log('checking tools');
		}
	}
}
