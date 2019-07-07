import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ElementRef, Input, OnDestroy, OnInit,
  ViewChild,
} from '@angular/core';
import {TimeService} from "../../services/time.service";
import {Draggable, Droppable} from "@shopify/draggable"
import {CardsService} from "../../services/cards.service";
import {Mechanic} from "../../objects/mechanic";
import {DaysService} from "../../services/days.service";
import {Card} from "../../objects/card";

@Component({
  selector: 'app-mechanic-line',
  templateUrl: './mechanic-line.component.html',
  styleUrls: ['./mechanic-line.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MechanicLineComponent implements OnInit, OnDestroy {

  private hours: number[];
  private quarters: string[];

  private assignedCards: any[];

  private cardsSubscription: any;

  @Input() mechanic: Mechanic;
  @Input() day: string;

  private cards: Card[];

  constructor(
    private timeService: TimeService,
    private cardsService: CardsService,
    private daysService: DaysService,
    private cdRef: ChangeDetectorRef
  ) {
    this.hours = this.timeService.getHours();
    this.quarters = this.timeService.getQuarters();
    this.assignedCards = [{id: 6, width: 150, left: 180, top: 120}];
  }

  ngOnInit(): void {
    if (this.cardsService.assignedDaysCards$[this.day][this.mechanic.position]) {
      console.log(this.day, this.mechanic.position, 'siiiiii');
      this.cardsSubscription = this.cardsService.assignedDaysCards$[this.day][this.mechanic.position].subscribe(cards => {
        console.log('RECEIVING', this.day, this.mechanic, cards);
        this.cards = cards;
        this.cdRef.detectChanges();
      });
    }
  }

  ngOnDestroy(): void {
    this.cardsSubscription.unsubscribe();
  }

  trackByItem(index, item) {
    return item;
  }

  get lineHeight$() {
    return this.daysService.lineHeight$;
  }

  check() {
    console.log('checking mechanic line', this.day, this.mechanic, this.cards);
  }

}
