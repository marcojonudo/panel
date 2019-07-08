import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {Draggable, Droppable} from "@shopify/draggable"

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements AfterViewInit {
	title = 'Panel';

	constructor(
		private cdRef: ChangeDetectorRef
	) {
	}

	ngAfterViewInit(): void {
		this.cdRef.detach();
	}

	check() {
		console.log('checking app component');
	}

}
