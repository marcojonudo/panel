import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {Toast} from "../../objects/toasts/toast";
import {Constants} from "../../objects/constants";

@Component({
	selector: 'app-toasts-container',
	templateUrl: './toasts-container.component.html',
	styleUrls: ['./toasts-container.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastsContainerComponent {

	@Input() toast: Toast;

	constructor(private cdRef: ChangeDetectorRef) {}

	remove(): void {
		this.toast = undefined;
		this.cdRef.detectChanges();
	}

	check(): void {
		if (Constants.CHECK) {
			console.log('checking toast component', this.toast);
		}
	}

}
