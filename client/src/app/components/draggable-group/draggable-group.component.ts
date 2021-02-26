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
import {Dayjs} from "dayjs";
import {Card} from "../../objects/card";
import {NotificationService} from "../../services/notification.service";

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

	findHighlight(highlight: boolean): string {
		return highlight ? `0 0 4px 3px #ffc000` : undefined;
	}

	highlightOrderCards(day: Dayjs, orderNumber: number, highlight: boolean) {
		/* Se resaltan las fichas sólo si se pasa el ratón por encima de una asignada (tiene day) */
		if (day) {
			const orderGroups = CardsService.findOrderGroups(
				CardsService.assignedGroups.concat(CardsService.unassignedGroups),
				orderNumber
			);
			/* Sólo se resaltan las agrupaciones si están desagrupadas */
			if (orderGroups.length > 1) {
				orderGroups.forEach((g: CardsGroup) => {
					g.highlight = highlight;
				});
				const assignedGroups = orderGroups.filter((g: CardsGroup) => g.day != undefined);
				const unassignedGroups = orderGroups.filter((g: CardsGroup) => g.day == undefined);
				if (assignedGroups.length) {
					NotificationService.notifyGroups(assignedGroups, true);
				}
				if (unassignedGroups.length) {
					NotificationService.notifyBand(undefined, unassignedGroups);
				}
			}
		}
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
