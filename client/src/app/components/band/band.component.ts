import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {TimeService} from "../../services/time.service";
import {animate, animateChild, query, stagger, style, transition, trigger} from "@angular/animations";
import {Draggable, Droppable} from "@shopify/draggable"
import {CardPositionService} from "../../services/card-position.service";
import {CardsService} from "../../services/cards.service";

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
      ]),
      transition(':leave', [
        style({ transform: 'scale(1)', opacity: 1, width: '*'}),  // initial
        animate(200,
          style({ transform: 'scale(0.5)', opacity: 0, width: 0, margin: 0}))  // final
      ])
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BandComponent {

  @Input() cards: any[];

  private intervalsNumber: number;

  constructor(
    private timeService: TimeService,
    private cardPositionService: CardPositionService,
    private cardsService: CardsService
  ) {
    this.intervalsNumber = this.timeService.intervalsNumber;
  }

  get helperCard$() {
    return this.cardPositionService.helperCard$;
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

}
