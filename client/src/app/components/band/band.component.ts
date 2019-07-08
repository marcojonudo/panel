import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  Input, OnDestroy,
  OnInit,
} from '@angular/core';
import {TimeService} from "../../services/time.service";
import {animate, animateChild, query, stagger, style, transition, trigger} from "@angular/animations";
import {Draggable, Droppable} from "@shopify/draggable"
import {CardPositionService} from "../../services/card-position.service";
import {CardsService} from "../../services/cards.service";
import {Card} from "../../objects/card";

@Component({
  selector: 'app-band',
  templateUrl: './band.component.html',
  styleUrls: ['./band.component.css'],
  animations: [
    trigger('unassigned-cards-container', [
      transition(':enter', [
        query('@unassigned-card', stagger(100, animateChild()))
      ]),
    ]),
    trigger('unassigned-card', [
      transition(':enter', [
        style({ transform: 'scale(0.5)', opacity: 0 }),  // initial
        animate(200,
          style({ transform: 'scale(1)', opacity: 1 }))  // final
      ])
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BandComponent implements OnInit, OnDestroy {

  @Input() cards: Card[];

  private intervalsNumber: number;
  private unassignedCards: Card[];

  private unassignedCardsSubscription;

  constructor(
    private timeService: TimeService,
    private cardPositionService: CardPositionService,
    private cardsService: CardsService,
    private cdRef: ChangeDetectorRef
  ) {
    this.intervalsNumber = this.timeService.intervalsNumber;
  }

  ngOnInit(): void {
    this.unassignedCardsSubscription = this.cardsService.unassignedCards$.subscribe( unassignedCards => {
      this.unassignedCards = unassignedCards;
      this.cdRef.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.unassignedCardsSubscription();
  }

  get cards$() {
    return this.cardsService.unassignedCards$;
  }

  check() {
    console.log('checking band')
  }

  trackById(index, item) {
    return item.id;
  }

  forceCardCd() {
    /* Force card CD to save the new positions, once the dragged card is outside the unassigned list */
    this.cdRef.detectChanges();
  }

}
