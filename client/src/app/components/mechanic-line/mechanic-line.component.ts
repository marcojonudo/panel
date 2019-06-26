import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef, Input,
  ViewChild,
} from '@angular/core';
import {TimeService} from "../../services/time.service";
import {Draggable, Droppable} from "@shopify/draggable"
import {CardsService} from "../../services/cards.service";

@Component({
  selector: 'app-mechanic-line',
  templateUrl: './mechanic-line.component.html',
  styleUrls: ['./mechanic-line.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MechanicLineComponent implements AfterViewInit {

  private hours: number[];
  private quarters: string[];

  private assignedCards: any[];

  @Input() mechanic: string;

  @ViewChild('dropzone', {static: true}) dropzone: ElementRef;

  constructor(
    private timeService: TimeService,
    private cardsService: CardsService
  ) {
    this.hours = this.timeService.getHours();
    this.quarters = this.timeService.getQuarters();
    this.assignedCards = [{id: 6, width: 150, left: 180, top: 120}];
  }

  ngAfterViewInit() {
    this.timeService.calculateIntervalWidth(this.dropzone.nativeElement.offsetWidth);
  }

  trackByItem(index, item) {
    return item;
  }

  get unassignedCardsDay$() {
    return this.cardsService.unassignedCardsDays$;
  }

  check() {
    console.log('checking mechanic line');
  }

}
