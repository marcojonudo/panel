import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Card} from "../../objects/card";
import {CardsGroup} from "../../objects/cards-group";
import {Constants} from "../../objects/constants";

@Component({
	selector: 'app-helper-draggable-group',
	templateUrl: './helper-draggable-group.component.html',
	styleUrls: ['./helper-draggable-group.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class HelperDraggableGroupComponent {

	@Input() cardsGroup: CardsGroup;

	check(): void {
		if (Constants.CHECK) {
			console.log('checking helper draggable group', this.cardsGroup.cards);
		}
	}

}
