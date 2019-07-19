import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Card} from "../../objects/card";

@Component({
	selector: 'app-draggable-group',
	templateUrl: './draggable-group.component.html',
	styleUrls: ['./draggable-group.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DraggableGroupComponent {

	@Input() cards: Card[];

	check(): void {
		console.log('checking draggable group', this.cards);
	}

}
