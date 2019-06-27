import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {TimeService} from "../../services/time.service";
import {CardsService} from "../../services/cards.service";
import {DaysService} from "../../services/days.service";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements AfterViewInit {

  //TODO Cambiar tipo
  private daysPanels: any[];
  private itemSize: number;

  private relativeContainer: boolean;
  private scrollLeft: number;
  private scrollTop: number;
  // private _scrollLeft: number;

  // private clickedCardSubject;
  // private clickedCard$: Observable<boolean>;
  // private startPosition;

  // private unassignedCardsDays: any;
  private unassignedCards: any[];
  // private assignedCards: any[];
  // private testList: any[];

  // private position: any;

  // private hide: boolean;

  @ViewChild('draggableContainer', {static: true}) draggableContainer: ElementRef;

  constructor(
    private daysService: DaysService,
    private timeService: TimeService
  ) {
    this.daysPanels = this.daysService.days;
    // this.itemSize = this.mechanicsService.mechanics.length * (Constants.VALUE.LINE_HEIGHT_DEFAULT + 10);

    this.relativeContainer = true;
    this.scrollLeft = 0;
    this.scrollTop = 0;

    this.unassignedCards = [{id: 1, width: 350}];
  }

  ngAfterViewInit(): void {
    // this.cdRef.detach();
    // this.cdRef.detectChanges();
  }

  get oneDayMode$() {
    return this.daysService.oneDayMode$;
  }

  get width$() {
    return this.timeService.width$
  }

  // get assignedDaysCards$() {
  //   return this.cardsService.assignedDaysCards$;
  // }

  trackByDay(index, item) {
    return item
  }

  check() {
    console.log('checking main');
  }

}
