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

@Component({
  selector: 'app-mechanic-line',
  templateUrl: './mechanic-line.component.html',
  styleUrls: ['./mechanic-line.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MechanicLineComponent implements OnInit, AfterViewInit, OnDestroy {

  private hours: number[];
  private quarters: string[];

  private assignedCards: any[];

  private cardsSubscription: any;

  @Input() mechanic: Mechanic;
  @Input() day: string;

  private cards: any[];

  @ViewChild('dropzone', {static: true}) dropzone: ElementRef;

  constructor(
    private timeService: TimeService,
    private cardsService: CardsService,
    private cdRef: ChangeDetectorRef
  ) {
    this.hours = this.timeService.getHours();
    this.quarters = this.timeService.getQuarters();
    this.assignedCards = [{id: 6, width: 150, left: 180, top: 120}];
  }

  ngOnInit(): void {
    if (this.cardsService.assignedDaysCards$[this.day][this.mechanic.position]) {
      this.cardsSubscription = this.cardsService.assignedDaysCards$[this.day][this.mechanic.position].subscribe(cards => {
        this.cards = cards;
        this.cdRef.detectChanges();
      });
    }
  }

  ngAfterViewInit() {
    this.timeService.dropzoneWidth = this.dropzone.nativeElement.offsetWidth;
    console.log('mechanic line after view init', this.dropzone.nativeElement.offsetWidth);
    // this.cardsService.initPosition(thi s.cards);
    // this.timeService.calculateIntervalWidth(this.dropzone.nativeElement.offsetWidth);
  }

  ngOnDestroy() {
    this.cardsSubscription.unsubscribe();
  }

  trackByItem(index, item) {
    return item;
  }

  check() {
    console.log('checking mechanic line', this.day, this.mechanic, this.cards);
  }

}
