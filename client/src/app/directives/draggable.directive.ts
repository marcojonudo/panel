import {
  AfterViewChecked,
  Directive, ElementRef,
  HostBinding, Input, OnChanges,
  OnDestroy,
  OnInit, Renderer2,
} from '@angular/core';
import {Coordinates} from "../objects/coordinates";
import {CardPositionService} from "../services/card-position.service";
import {TimeService} from "../services/time.service";
import {Card} from "../objects/card";

@Directive({
  selector: '[appDraggable]',
  exportAs: 'appDraggable'
})
export class DraggableDirective implements OnInit, AfterViewChecked, OnDestroy {

  @Input() card: Card;

  private cardRect;

  private startPosition: Coordinates;
  private startEventCoordinates: Coordinates;
  private position: Coordinates;

  private dropzonePositionListener: any;
  private dropzonePosition: any;

  private pointerDownListener;
  private pointerMoveListener;
  private pointerUpListener;

  @HostBinding('class.draggable') draggable: boolean;
  @HostBinding('class.dragging') dragging: boolean;

  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
    private cardPositionService: CardPositionService,
    private timeService: TimeService
  ) {
    this.draggable = true;
    this.dragging = false;

    this.position = new Coordinates(0, 0);
  }

  ngOnInit() {
    this.cardRect = this.element.nativeElement.getBoundingClientRect();
    this.pointerDownListener = this.renderer.listen(this.element.nativeElement, 'pointerdown', this.onPointerDown.bind(this));

    this.dropzonePositionListener = this.cardPositionService.dropzone$.subscribe(dropzone => {
      this.dropzonePosition = dropzone ? dropzone.rect : undefined;
    });
  }

  ngAfterViewChecked(): void {
    this.cardRect = this.element.nativeElement.getBoundingClientRect();
  }

  ngOnDestroy() {
    this.dropzonePositionListener.unsubscribe()
  }

  onPointerDown(event: PointerEvent): void {
    this.dragging = true;

    this.startPosition = new Coordinates(
      this.cardRect.left,
      this.cardRect.top
    );

    console.log('start position', this.startPosition);

    this.startEventCoordinates = new Coordinates(event.clientX, event.clientY);

    this.cardPositionService.emitHelperCard(this.card);
    this.cardPositionService.emitDragging(true);
    this.cardPositionService.emitPosition(this.startPosition);

    this.pointerMoveListener = this.renderer.listen('document', 'pointermove', this.onPointerMove.bind(this));
    this.pointerUpListener = this.renderer.listen('document', 'pointerup', this.onPointerUp.bind(this));
  }

  onPointerMove(event: PointerEvent): void {
    if (this.dragging) {
      this.position.x = this.startPosition.x + event.clientX - this.startEventCoordinates.x;
      this.position.y = this.startPosition.y + event.clientY - this.startEventCoordinates.y;
      this.cardPositionService.emitPosition(this.position);
    }
  }

  onPointerUp(): void {
    if (this.dragging) {
      this.dragging = false;

      if (this.dropzonePosition) {
        const leftIntervals = Math.floor((this.position.x - 180) / this.timeService.intervalWidth);
        const x = 180 + leftIntervals * this.timeService.intervalWidth;
        const y = this.position.y > this.dropzonePosition.top + this.dropzonePosition.height/4 ? this.dropzonePosition.y + this.dropzonePosition.height/2 : this.dropzonePosition.y;
        this.position = new Coordinates(x, y);
      } else {
        this.position = this.startPosition;
        this.cardPositionService.emitDropzone(undefined);
      }

      this.cardPositionService.emitPosition(this.position);
      // this.cardPositionService.emitHelperCard(undefined);
      this.pointerMoveListener();
      this.pointerUpListener();

      /* Evento emitido para forzar una última vez el CD, una vez establecida la nueva posición */
      this.cardPositionService.emitDragging(this.dragging);
    }
  }

}
