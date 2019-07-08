import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {CardPositionService} from "../../services/card-position.service";
import {animate, animateChild, query, stagger, style, transition, trigger} from "@angular/animations";
import {Card} from "../../objects/card";
import {DaysService} from "../../services/days.service";
import {CardsService} from "../../services/cards.service";

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverlayComponent implements OnInit, OnDestroy {

  private coordinatesSubscription: any;
  private draggingSubscription: any;
  private helperCardSubscription: any;

  private helperCard: Card;
  private dragging: boolean;

  constructor(
    private cardPositionService: CardPositionService,
    private daysService: DaysService,
    private cardsService: CardsService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.coordinatesSubscription = this.cardPositionService.coordinates$.subscribe(coordinates => {
      this.cdRef.detectChanges();
    });

    /* Permite asignar la clase CSS de transición justo cuando se levanta el ratón, y forzar el último CD una vez
    *  se ha establecido la última posición */
    this.draggingSubscription = this.cardPositionService.dragging$.subscribe(dragging => {
      this.dragging = dragging;
      this.cdRef.detectChanges();

      /* Cuando se deja de arrastrar (dragging = false y helperCard = true), se elimina la ficha del origen. De esta
      *  forma, se evitan problemas de parpadeos al modificar la propiedad 'visibility' para lograr los efectos
      *  buscados */
      if (!this.dragging && this.helperCard && this.cardPositionService.dropzone) {
        console.log('en la subscription', this.dragging, this.helperCard, this.cardPositionService.dropzone);
        this.cardsService.removeCardFromOrigin(this.helperCard);
      }
    });

    /* Permite mostrar o eliminar la ficha auxiliar en pantalla */
    this.helperCardSubscription = this.cardPositionService.helperCard$.subscribe(helperCard => {
      /* Cuando se borra la ficha auxiliar (terminó la transición o se soltó la ficha en la barra inferior), se
      *  ejecutan las operaciones necesarias para actualizar la ficha */
      if (!helperCard && this.cardPositionService.dropzone) {
        this.cardsService.updateCard(this.cardPositionService.dropzone.mechanic, this.helperCard);
      }

      this.helperCard = helperCard;
      this.cdRef.detectChanges();
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
    // console.log('checking overlay');
  }

  updateCard() {
    this.cardPositionService.emitHelperCard(undefined);
  }

}
