import {ChangeDetectionStrategy, Component, enableProdMode, OnInit} from '@angular/core';
import {DaysService} from "./services/days.service";
import {TimeService} from "./services/time.service";
import {MechanicsService} from "./services/mechanics.service";
import {Constants} from "./objects/constants";
import interact from "interactjs";
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {Observable} from "rxjs/internal/Observable";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  title = 'Panel';

  //TODO Cambiar tipo
  private daysPanels: any[];
  private itemSize: number;

  private clickedCardSubject;
  private clickedCard$: Observable<boolean>;
  private startPosition;

  private unassignedCards: any[];

  constructor(
    private daysService: DaysService,
    private timeService: TimeService,
    private mechanicsService: MechanicsService
  ) {
    this.daysPanels = this.daysService.days;
    this.itemSize = this.mechanicsService.mechanics.length * (Constants.VALUE.LINE_HEIGHT_DEFAULT + 10);

    this.clickedCardSubject = new BehaviorSubject<boolean>(false);
    this.clickedCard$ = this.clickedCardSubject.asObservable();

    this.unassignedCards = [{id: 1, width: 350}, {id: 2, width: 150}, {id: 3, width: 150}, {id: 4, width: 150}, {id: 5, width: 150}];
    // this.unassignedCards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
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

  ngOnInit() {
    interact('.draggable')
      .draggable({
        inertia: true,
        modifiers: [
          interact.modifiers.snap({
            targets: [() => {
              return this.startPosition;
            }],
            endOnly: true,
            relativePoints: [ { x: 0, y: 0 } ]
          })
        ],
        autoScroll: true,

        onstart: (event) => this.onStart(event),
        onmove: this.onMove,
        onend: (event) => this.onEnd(event)
      })
      .on('mouseup', (event) => {
        event.target.setAttribute('data-record-position', false);

        if (event.target.getAttribute('data-dropzone')) {
          const id = event.target.getAttribute('id');
          // this.unassignedCards.find((card) => card.id == id);
          this.unassignedCards = this.unassignedCards.filter((card) => card.id != id)
        }
      });
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

}
