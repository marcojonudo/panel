import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component
} from '@angular/core';
import {Draggable, Droppable} from "@shopify/draggable"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements AfterViewInit {
  title = 'Panel';

  // //TODO Cambiar tipo
  // private daysPanels: any[];
  // private itemSize: number;
  //
  // private relativeContainer: boolean;
  // private scrollLeft: number;
  // private scrollTop: number;
  // // private _scrollLeft: number;
  //
  // // private clickedCardSubject;
  // // private clickedCard$: Observable<boolean>;
  // // private startPosition;
  //
  // private unassignedCardsDays: any;
  // private unassignedCards: any[];
  // private assignedCards: any[];
  // // private testList: any[];
  //
  // // private position: any;
  //
  // // private hide: boolean;
  //
  // @ViewChild('draggableContainer', {static: true}) draggableContainer: ElementRef;
  //
  constructor(
    // private daysService: DaysService,
    // private timeService: TimeService,
    // private mechanicsService: MechanicsService,
    // private cardsService: CardsService,
    private cdRef: ChangeDetectorRef
  ) {}

  //   this.daysPanels = this.daysService.days;
  //   this.itemSize = this.mechanicsService.mechanics.length * (Constants.VALUE.LINE_HEIGHT_DEFAULT + 10);
  //
  //   this.relativeContainer = true;
  //   this.scrollLeft = 0;
  //   this.scrollTop = 0;
  //
  //   // this.clickedCardSubject = new BehaviorSubject<boolean>(false);
  //   // this.clickedCard$ = this.clickedCardSubject.asObservable();
  //
  //   // this.unassignedCardsDays = {
  //   //   '2019-06-25': {
  //   //     'A': [{id: 1, width: 350}, {id: 2, width: 150}, {id: 3, width: 150}, {id: 4, width: 150}, {id: 5, width: 150}],
  //   //     'B': [{id: 1, width: 350}, {id: 2, width: 150}, {id: 3, width: 150}, {id: 4, width: 150}, {id: 5, width: 150}],
  //   //   },
  //   //   '2019-06-26': {
  //   //     'B': [{id: 1, width: 350}, {id: 2, width: 150}, {id: 3, width: 150}, {id: 4, width: 150}, {id: 5, width: 150}],
  //   //     'C': [{id: 1, width: 350}, {id: 2, width: 150}, {id: 3, width: 150}, {id: 4, width: 150}, {id: 5, width: 150}],
  //   //   },
  //   //   '2019-06-27': {
  //   //     'A': [{id: 1, width: 350}, {id: 2, width: 150}, {id: 3, width: 150}, {id: 4, width: 150}, {id: 5, width: 150}],
  //   //     'C': [{id: 1, width: 350}, {id: 2, width: 150}, {id: 3, width: 150}, {id: 4, width: 150}, {id: 5, width: 150}],
  //   //   },
  //   // };
  //
  //   this.unassignedCards = [{id: 1, width: 350}, {id: 2, width: 150}, {id: 3, width: 150}, {id: 4, width: 150}, {id: 5, width: 150}];
  //   this.assignedCards = [{day: '2019-06-12', id: 6, width: 150, left: 180, top: 120}];
  // }
  //
  ngAfterViewInit(): void {
    this.cdRef.detach();
  }
  //
  // get oneDayMode$() {
  //   return this.daysService.oneDayMode$;
  // }
  //
  // get width$() {
  //   return this.timeService.width$
  // }
  //
  // getDayCards(day: string) {
  //   const c = this.assignedCards.filter((card) => card.day == day);
  //   return this.assignedCards.filter((card) => card.day == day);
  // }
  //
  // // get assignedDaysCards$() {
  // //   return this.cardsService.assignedDaysCards$;
  // // }
  //
  // trackByDay(index, item) {
  //   return item
  // }

  check() {
    console.log('checking app component');
  }

}
