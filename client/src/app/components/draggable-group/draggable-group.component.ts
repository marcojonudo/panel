import {
	Component,
	EventEmitter,
	Input,
	Output
} from '@angular/core';
import {CardsGroup} from "../../objects/cards-group";
import {Constants} from "../../objects/constants";

@Component({
	selector: 'app-draggable-group',
	templateUrl: './draggable-group.component.html',
	styleUrls: ['./draggable-group.component.css']
})
export class DraggableGroupComponent {

	@Input() cardsGroup: CardsGroup;
	@Output() hide: EventEmitter<boolean>;

	constructor() {
		this.hide = new EventEmitter<boolean>();
	}

	check(): void {
		if (Constants.CHECK) {
			console.log('checking draggable group', this.cardsGroup.cards);
		}
	}

	hideComponent(hide: boolean) {
		/* En el caso de líneas de mecánicos, ocultar la ficha consiste en asignar un z-index negativo al host, en
		*  lugar de operar sobre el template. De esta forma, se evitan problemas con el onMouseMove del dropzone (al
		*  estar la ficha encima, aunque oculta, no se lanzaba el evento) */
		this.hide.emit(hide);
	}

}
