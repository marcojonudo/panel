import {
	Component,
	EventEmitter,
	Input,
	Output
} from '@angular/core';
import {CardsGroup} from "../../objects/cards-group";
import {Constants} from "../../objects/constants";
import {CardsService} from "../../services/cards.service";
import {CardTypeBehaviour} from "../../objects/card-type-behaviour/card-type-behaviour";

@Component({
	selector: 'app-draggable-group',
	templateUrl: './draggable-group.component.html',
	styleUrls: ['./draggable-group.component.css']
})
export class DraggableGroupComponent {

	@Input() cardsGroup: CardsGroup;

	@Output() hiddenCardsGroup: EventEmitter<CardsGroup>;

	constructor(private cardsService: CardsService) {
		this.hiddenCardsGroup = new EventEmitter();
	}

	findCardBehaviour(group: CardsGroup): CardTypeBehaviour {
		return this.cardsService.findCardTypeBehaviour(group.cards[0].type);
	}

	findCursor(mode: string): string {
		return Constants.GROUP_MODE_CURSOR[mode];
	}

	emitHiddenCardsGroup(cardsGroup: CardsGroup) {
		/* En el caso de líneas de mecánicos, ocultar la ficha consiste en asignar un z-index negativo al host, en
		*  lugar de operar sobre el template. De esta forma, se evitan problemas con el onMouseMove del dropzone (al
		*  estar la ficha encima, aunque oculta, no se lanzaba el evento) */
		this.hiddenCardsGroup.emit(cardsGroup);
	}

	check(): void {
		if (Constants.CHECK) {
			console.log('checking draggable group', this.cardsGroup);
		}
	}

}
