import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  ElementRef, Input,
  OnInit, Renderer2,
  ViewChildren
} from '@angular/core';
import interact from "interactjs"
import {Observable} from "rxjs/internal/Observable";
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {TimeService} from "../../services/time.service";

@Component({
  selector: 'app-band',
  templateUrl: './band.component.html',
  styleUrls: ['./band.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BandComponent implements OnInit {

  @Input() clickedCard$: Observable<boolean>;

  private clickedCardSubscription: any;

  private cards: number[];
  private intervalsNumber: number;

  constructor(private timeService: TimeService) {
    this.cards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    // this.clickedCardSubject = new BehaviorSubject<boolean>(false);
    // this.clickedCard$ = this.clickedCardSubject.asObservable();
    this.intervalsNumber = this.timeService.intervalsNumber;
  }

  ngOnInit() {
    // this.clickedCardSubscription = this.clickedCard$.subscribe((value) => {
    //   console.log('value');
    //   console.log(value);
    // })
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
    //     autoScroll: true,
    //
    //     onstart: (event) => {
    //       event.target.setAttribute('data-record-position', true);
    //
    //       const rect = interact.getElementRect(event.target);
    //       this.startPosition = {x: rect.left, y: rect.top};
    //
    //       event.target.setAttribute('data-start-x', this.startPosition.x);
    //       event.target.setAttribute('data-start-y', this.startPosition.y);
    //
    //       this.clickedCardSubject.next(true)
    //     },
    //     onmove: this.dragMoveListener,
    //     onend: () => this.onEnd()
    //   })
    //   .on('mouseup', (event) => {
    //     event.target.setAttribute('data-record-position', false);
    //   });
  }

  // ngOnDestroy() {
  //   this.clickedCardSubscription.unsubscribe()
  // }

  // dragMoveListener(event) {
  //   const target = event.target;
  //   // keep the dragged position in the data-x/data-y attributes
  //   const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
  //   const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
  //
  //   // translate the element
  //   target.style.webkitTransform =
  //     target.style.transform =
  //       'translate(' + x + 'px, ' + y + 'px)';
  //
  //   // update the posiion attributes
  //   target.setAttribute('data-x', x);
  //   target.setAttribute('data-y', y);
  // }
  //
  // onEnd() {
  //   this.clickedCardSubject.next(false)
  //
  // }

  // clickedCard(clicked: boolean) {
  //   this.clickedCardSubject.next(clicked)
  // }

  check() {
    // console.log(this.clickedCard2)
  }

}
