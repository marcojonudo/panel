import {
	Component,
	EventEmitter,
	Input,
	Output
} from '@angular/core';
import {CardsGroup} from "../../objects/cards-group";
import {Constants} from "../../objects/constants";
import {AuxiliaryCardBehaviour} from "../../objects/card-behaviour/auxiliary-card-behaviour";
import {DefaultCardBehaviour} from "../../objects/card-behaviour/default-card-behaviour";

@Component({
	selector: 'app-draggable-group',
	templateUrl: './draggable-group.component.html',
	styleUrls: ['./draggable-group.component.css']
})
export class DraggableGroupComponent {

	@Input() cardsGroup: CardsGroup;
	@Output() hiddenCardsGroup: EventEmitter<CardsGroup>;

	private readonly CARD_BEHAVIOUR: any;

	constructor() {
		this.hiddenCardsGroup = new EventEmitter();
		this.CARD_BEHAVIOUR = {
			'AUXILIARY': (group: CardsGroup) => new AuxiliaryCardBehaviour(group),
			'DEFAULT': (group: CardsGroup) => new DefaultCardBehaviour(group)
		}
	}

	findCardBehaviour(group: CardsGroup): Function {
		return this.CARD_BEHAVIOUR[group.cards[0].type] ?
			this.CARD_BEHAVIOUR[group.cards[0].type](group) :
			this.CARD_BEHAVIOUR[Constants.DEFAULT](group)
	}

	emitHiddenCardsGroup(cardsGroup: CardsGroup) {
		/* En el caso de líneas de mecánicos, ocultar la ficha consiste en asignar un z-index negativo al host, en
		*  lugar de operar sobre el template. De esta forma, se evitan problemas con el onMouseMove del dropzone (al
		*  estar la ficha encima, aunque oculta, no se lanzaba el evento) */
		this.hiddenCardsGroup.emit(cardsGroup);
	}

	check(): void {
		if (Constants.CHECK) {
			console.log('checking draggable group', this.cardsGroup.cards[0].order.code);
		}
	}

}
