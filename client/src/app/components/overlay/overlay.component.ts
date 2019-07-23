import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {CardPositionService} from "../../services/card-position.service";
import {Card} from "../../objects/card";
import {DaysService} from "../../services/days.service";
import {CardsService} from "../../services/cards.service";
import {CardsGroup} from "../../objects/cards-group";

@Component({
	selector: 'app-overlay',
	templateUrl: './overlay.component.html',
	styleUrls: ['./overlay.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverlayComponent implements OnInit, OnDestroy {

	private coordinatesSubscription: any;
	private draggingSubscription: any;
	private helperCardsGroupSubscription: any;

	private helperCardsGroup: CardsGroup;
	private dragging: boolean;

	constructor(
		private cardPositionService: CardPositionService,
		private daysService: DaysService,
		private cardsService: CardsService,
		private cdRef: ChangeDetectorRef
	) { }

	ngOnInit(): void {
		this.coordinatesSubscription = this.cardPositionService.coordinates$.subscribe(coordinates => {
			console.log('------------------------------------------------------------------------- 1');
			this.cdRef.detectChanges();
		});

		/* Permite asignar la clase CSS de transición justo cuando se levanta el ratón, y forzar el último CD una vez
		*  se ha establecido la última posición */
		this.draggingSubscription = this.cardPositionService.dragging$.subscribe(dragging => {
			this.dragging = dragging;
			console.log('------------------------------------------------------------------------- 2');
			console.time('[overlay] draggingSubscriptionChanges');
			this.cdRef.detectChanges();
			console.timeEnd('[overlay] draggingSubscriptionChanges');

			/* Cuando se deja de arrastrar (dragging = false y helperCardsGroup = true), se elimina la ficha del origen. De esta
			*  forma, se evitan problemas de parpadeos al modificar la propiedad 'visibility' para lograr los efectos
			*  buscados */
			if (!this.dragging && this.helperCardsGroup && this.cardPositionService.dropzone) {
				console.time('[overlay] removeCardsFromOrigin');
				this.cardsService.removeCardsFromOrigin(this.helperCardsGroup);
				console.timeEnd('[overlay] removeCardsFromOrigin');
			}
		});

		/* Permite mostrar o eliminar la ficha auxiliar en pantalla */
		this.helperCardsGroupSubscription = this.cardPositionService.helperCardsGroup$.subscribe(helperCardsGroup => {
			/* Cuando se borra la ficha auxiliar (terminó la transición o se soltó la ficha en la barra inferior), se
			*  ejecutan las operaciones necesarias para actualizar la ficha */
			console.time('[overlay][helperCardSubscription]');
			if (!helperCardsGroup && this.cardPositionService.dropzone) {
				console.time('[overlay] updateTranslatedCards');
				this.cardsService.updateTranslatedCards(
					this.helperCardsGroup,
					this.cardPositionService.dropzone.mechanic,
					this.cardPositionService.position
				);
				console.timeEnd('[overlay] updateTranslatedCards');
			}

			this.helperCardsGroup = helperCardsGroup;
			console.log('------------------------------------------------------------------------- 3');
			this.cdRef.detectChanges();
			console.timeEnd('[overlay][helperCardSubscription]');
		});
	}

	ngOnDestroy(): void {
		this.coordinatesSubscription.unsubscribe();
		this.draggingSubscription.unsubscribe();
	}

	get lineHeight$() {
		return this.daysService.lineHeight$;
	}

	check(): void {
		console.log('checking overlay');
	}

	updateCard() {
		console.log('UPDATE CARD EN OVERLAY');
		// this.cardPositionService.emitHelperCardsGroup(undefined);
	}

}
