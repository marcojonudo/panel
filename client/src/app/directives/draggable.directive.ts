import {
  Directive, ElementRef,
  HostBinding,
  OnDestroy,
  OnInit, Renderer2,
} from '@angular/core';
import {Coordinates} from "../objects/coordinates";
import {CardPositionService} from "../services/card-position.service";
import {TimeService} from "../services/time.service";

@Directive({
  selector: '[appDraggable]',
  exportAs: 'appDraggable'
})
export class DraggableDirective implements OnInit, OnDestroy {

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

    this.dropzonePositionListener = this.cardPositionService.dropzonePosition$.subscribe(position => {
      this.dropzonePosition = position
    });
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

    this.startEventCoordinates = new Coordinates(event.clientX, event.clientY);

    this.cardPositionService.emitHelperCard({id: 1, width: 150});
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
      // Evento emitido para asignar la clase que posibilita la transicion CSS a su posición
      this.cardPositionService.emitDragging(this.dragging);

      if (this.dropzonePosition) {
        const leftIntervals = Math.floor((this.position.x - 180) / this.timeService.intervalWidth);
        const x = 180 + leftIntervals * this.timeService.intervalWidth;
        const y = this.position.y > this.dropzonePosition.top + this.dropzonePosition.height/4 ? this.dropzonePosition.y + this.dropzonePosition.height/2 : this.dropzonePosition.y;
        this.position = new Coordinates(x, y);
      } else {
        this.position = this.startPosition;
      }

      this.cardPositionService.emitPosition(this.position);
      // this.cardPositionService.emitHelperCard(undefined);
      this.pointerMoveListener();
      this.pointerUpListener();

      // Evento emitido para forzar una última vez el CD, una vez establecida la nueva posición
      this.cardPositionService.emitDragging(this.dragging);
    }
  }

  // onDropMove(event) {
  //   const draggableRect = interact.getElementRect(event.relatedTarget);
  //   const leftIntervals = Math.floor((draggableRect.left - (180 - this.scrollLeft)) / this.timeService.intervalWidth);
  //   const left = (180 - this.scrollLeft) + leftIntervals * this.timeService.intervalWidth;
  //
  //   const dropzoneRect = interact.getElementRect(event.target);
  //   const dropzoneTop = draggableRect.top > dropzoneRect.top + dropzoneRect.height/4 ? dropzoneRect.top + dropzoneRect.height/2 : dropzoneRect.top;
  //
  //   event.relatedTarget.setAttribute('data-left', left);
  //   event.relatedTarget.setAttribute('data-dropzone-top', dropzoneTop);
  //   console.log({x: left, y: dropzoneTop});
  //   event.draggable.options.drag.modifiers[0].options.targets[0] = () => {
  //     return {x: left, y: dropzoneTop}
  //   };
  // }

}
