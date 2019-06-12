import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  enableProdMode,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import {DaysService} from "./services/days.service";
import {TimeService} from "./services/time.service";
import {MechanicsService} from "./services/mechanics.service";
import {Constants} from "./objects/constants";
import interact from "interactjs";
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {Observable} from "rxjs/internal/Observable";
import {ScrollDispatchModule} from '@angular/cdk/scrolling';
import {CardPositionService} from "./services/card-position.service";
import {Draggable, Droppable} from "@shopify/draggable"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'Panel';

  //TODO Cambiar tipo
  private daysPanels: any[];
  private itemSize: number;

  private relativeContainer: boolean;
  private scrollLeft: number;
  private scrollTop: number;
  private _scrollLeft: number;

  private clickedCardSubject;
  private clickedCard$: Observable<boolean>;
  private startPosition;

  private unassignedCards: any[];
  private assignedCards: any[];
  private testList: any[];

  private position: any;

  private hide: boolean;

  @ViewChild('draggableContainer', {static: true}) draggableContainer: ElementRef;

  constructor(
    private daysService: DaysService,
    private timeService: TimeService,
    private mechanicsService: MechanicsService,
    private cardPositionService: CardPositionService,
    private renderer: Renderer2
  ) {
    this.daysPanels = this.daysService.days;
    this.itemSize = this.mechanicsService.mechanics.length * (Constants.VALUE.LINE_HEIGHT_DEFAULT + 10);

    this.relativeContainer = true;
    this.scrollLeft = 0;
    this.scrollTop = 0;

    this.clickedCardSubject = new BehaviorSubject<boolean>(false);
    this.clickedCard$ = this.clickedCardSubject.asObservable();

    this.unassignedCards = [{id: 1, width: 350}, {id: 2, width: 150}, {id: 3, width: 150}, {id: 4, width: 150}, {id: 5, width: 150}];
    this.assignedCards = [{id: 6, width: 150, left: 180, top: 120}];
    this.testList = [];
    // this.unassignedCards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  }

  get helperCard$() {
    return this.cardPositionService.helperCard$;
  }

  get oneDayMode$() {
    return this.daysService.oneDayMode$;
  }

  get width$() {
    return this.timeService.width$
  }

  trackByDay(index, item) {
    return item
  }

  checkComponent() {
    //console.log('Component')
  }

  ngAfterViewInit() {
    // const droppable = new Droppable(document.querySelectorAll('.dropzone-container'), {
    //   draggable: '.draggable',
    //   dropzone: '.dropzone'
    // });
    // droppable.on('droppable:dropped', () => console.log('droppppp'));
    // const draggable = new Draggable(
    //   document.querySelectorAll('#unassigned-cards-container'),
    //   {
    //     draggable: '.draggable'
    //   }
    // );
  }

  ngOnInit() {
    // interact('.draggable')
    //   .draggable({
    //     inertia: true,
    //     modifiers: [
    //       interact.modifiers.snap({
    //         targets: [() => {
    //           return this.startPosition;
    //         }],
    //         endOnly: true,
    //         relativePoints: [ { x: 0, y: 0 } ]
    //       })
    //     ],
    //     autoScroll: {
    //       container: document.getElementById('draggable-container')
    //     },
    //
    //     onstart: (event) => this.onStart(event),
    //     onmove: this.onMove,
    //     onend: (event) => this.onEnd(event)
    //   })
    //   .on('mouseup', (event) => {
    //     event.target.setAttribute('data-record-position', false);
    //
    //     if (event.target.getAttribute('data-dropzone')) {
    //       const id = event.target.getAttribute('id');
    //
    //       let index = undefined;
    //       const card = this.assignedCards.find((card, i) => {
    //         index = i;
    //         return card.id == id
    //       });
    //
    //       card.left = +event.target.getAttribute('data-left');
    //       card.top = +event.target.getAttribute('data-dropzone-top');
    //       this.unassignedCards.splice(index, 1);
    //       this.assignedCards.push(card);
    //     }
    //   });

  }

  onStart(event) {
    event.target.setAttribute('data-record-position', true);

    const rect = interact.getElementRect(event.target);
    this.startPosition = {x: rect.left, y: rect.top};

    event.target.setAttribute('data-start-x', this.startPosition.x);
    event.target.setAttribute('data-start-y', this.startPosition.y);

    event.interactable.options.drag.modifiers[0].options.targets[0] = () => {
      return this.startPosition;
    };

    this.clickedCardSubject.next(true)
    // this.clickedEmitter.emit(true);
    // this.clickedCard = true;
  }

  onMove(event) {
    const target = event.target;
    // keep the dragged position in the data-x/data-y attributes
    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
      target.style.transform =
        'translate(' + x + 'px, ' + y + 'px)';

    // console.log(x + ', ' + y);

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  }

  onEnd(event) {
    this.clickedCardSubject.next(false);
    // this.clickedEmitter.emit(false);
    // this.clickedCard = false;
  }

  checkEdge(event) {
    if (!event.right) {
      this.scrollLeft += 10;
      this.setScrollLeft(this.scrollLeft)
    } else if (!event.left) {
      this.scrollLeft -= 10;
      this.setScrollLeft(this.scrollLeft)
    }

    if (!event.top) {
      this.scrollTop -= 10;
      this.setScrollTop(this.scrollTop)
    } else if (!event.bottom) {
      this.scrollTop += 10;
      this.setScrollTop(this.scrollTop)
    }
  }

  setScrollLeft(value: number): void {
    this.renderer.setProperty(
      this.draggableContainer.nativeElement,
      Constants.PROPERTY.SCROLL_LEFT,
      value
    );
  }

  setScrollTop(value: number): void {
    this.renderer.setProperty(
      this.draggableContainer.nativeElement,
      Constants.PROPERTY.SCROLL_TOP,
      value
    );
  }

  changeLayout() {
    this.relativeContainer = !this.relativeContainer;
    this.hide = true;
    this.testList.push({id: 1, width: 350, position: {x: 0, y: 0}});

  }

  onStart2(event) {
    console.log(event.clientX)
  }

  onMoving(event) {
    console.log(event)
  }

  onMoveEnd(event) {
    console.log('onMoveEnd');
    console.log(event);
    // this.position = {x: 100, y: 100};
    this.testList.push({id: 1, width: 350, position: {x: 500, y: 200}});
  }

  getScrollLeft(event) {
    this.cardPositionService.scrollLeft = event.target.scrollLeft;
    // this._scrollLeft = event.target.scrollLeft;
  }

  test(event) {
    // console.log('testing');
    // console.log(event);
  }

}
