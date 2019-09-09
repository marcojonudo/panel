import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Card} from "../../objects/card";
import {CardsGroup} from "../../objects/cards-group";
import {Constants} from "../../objects/constants";

@Component({
	selector: 'app-draggable-group',
	templateUrl: './draggable-group.component.html',
	styleUrls: ['./draggable-group.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DraggableGroupComponent {

	@Input() cardsGroup: CardsGroup;

	check(): void {
		if (Constants.CHECK) {
			console.log('checking draggable group', this.cardsGroup.cards);
		}
	}

}
