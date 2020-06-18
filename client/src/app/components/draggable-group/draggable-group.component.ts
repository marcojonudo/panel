import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	Output
} from '@angular/core';
import {CardsGroup} from "../../objects/cards-group";
import {Constants} from "../../objects/constants";
import {CardsService} from "../../services/cards.service";
import {CardTypeBehaviour} from "../../objects/card-type-behaviour/card-type-behaviour";
import {UtilsService} from "../../services/utils.service";
import {DomSanitizer} from "@angular/platform-browser";
import {GroupUpdate} from "../../objects/trigger-cd/update-objects/groups/group-update";

@Component({
	selector: 'app-draggable-group',
	templateUrl: './draggable-group.component.html',
	styleUrls: ['./draggable-group.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DraggableGroupComponent {

	@Input() group: CardsGroup;
	@Input() groupUpdate: GroupUpdate;

	@Output() hiddenCardsGroup: EventEmitter<CardsGroup>;

	constructor(private cardsService: CardsService, private sanitizer: DomSanitizer) {
		this.hiddenCardsGroup = new EventEmitter();
	}

	findCardBehaviour(group: CardsGroup): CardTypeBehaviour {
		return CardsService.findCardTypeBehaviour(group.cards[0].type);
	}

	findCursor(mode: string): string {
		const cursorName = Constants.GROUP_MODE_CURSOR[mode];
		return UtilsService.isImage(cursorName)
			? this.sanitizer.bypassSecurityTrustStyle(`url(../../../assets/img/cursors/${cursorName}), auto`)
			: cursorName;
	}

	emitHiddenCardsGroup(group: CardsGroup) {
		/* En el caso de líneas de mecánicos, ocultar la ficha consiste en asignar un z-index negativo al host, en
		*  lugar de operar sobre el template. De esta forma, se evitan problemas con el onMouseMove del dropzone (al
		*  estar la ficha encima, aunque oculta, no se lanzaba el evento) */
		this.hiddenCardsGroup.emit(group);
	}

	check(): void {
		if (Constants.CHECK) {
			console.log('checking draggable group', this.group.id, this.group.start, this.groupUpdate);
		}
	}

}
