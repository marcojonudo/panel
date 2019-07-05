import {
  AfterViewChecked, ChangeDetectorRef,
  Directive, ElementRef,
  HostBinding, Input, OnChanges,
  OnDestroy,
  OnInit, Renderer2,
} from '@angular/core';
import {Coordinates} from "../objects/coordinates";
import {CardPositionService} from "../services/card-position.service";
import {TimeService} from "../services/time.service";
import {Card} from "../objects/card";
import {DropzoneInfo} from "../objects/dropzone-info";

@Directive({
  selector: '[appDraggable]',
  exportAs: 'appDraggable'
})
export class DraggableDirective implements OnInit, AfterViewChecked {

  @Input() card: Card;

  private cardRect;

  private startPosition: Coordinates;
  private startEventCoordinates: Coordinates;
  private position: Coordinates;

  // private dropzoneSubscription: any;
  // private dropzone: any;

  private pointerDownListener;
  private pointerMoveListener;
  private pointerUpListener;

  @HostBinding('class.draggable') draggable: boolean;
  @HostBinding('class.dragging')
  @HostBinding('class.hidden') dragging: boolean;

  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
    private cardPositionService: CardPositionService,
    private timeService: TimeService,
    private cdRef: ChangeDetectorRef
  ) {
    this.draggable = true;
    this.dragging = false;

    this.position = new Coordinates(0, 0);
  }

  ngOnInit() {
    this.pointerDownListener = this.renderer.listen(this.element.nativeElement, 'pointerdown', this.onPointerDown.bind(this));
  }

  ngAfterViewChecked(): void {
    this.cardRect = this.element.nativeElement.getBoundingClientRect();
  }

  onPointerDown(event: PointerEvent): void {
    this.dragging = true;
    /* Permite asignar la clase declarada mediante @HostBinding */
    this.cdRef.detectChanges();

    this.startPosition = new Coordinates(
      this.cardRect.left,
      this.cardRect.top
    );

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
      this.cdRef.detectChanges();

      /* Si la ficha se suelta encima de una línea o bandeja inferior (y no en un hueco vacío) */
      if (this.cardPositionService.dropzone) {
        /* Si la ficha se suelta encima de una línea (y no en la bandeja inferior) */
        if (this.cardPositionService.dropzone.mechanic) {
          console.log(1);
          const rect = this.cardPositionService.dropzone.rect;
          const leftIntervals = Math.floor((this.position.x - 180) / this.timeService.intervalWidth);
          const x = 180 + leftIntervals * this.timeService.intervalWidth;
          const y = this.position.y > rect.top + rect.height/4 ? rect.y + rect.height/2 : rect.y;
          this.position = new Coordinates(x, y);
        } else if (this.card.mechanicCode) {
          console.log(2);
          this.position = new Coordinates(this.position.x, this.position.y);
          // this.cardPositionService.emitHelperCard(undefined);
        } else {
          console.log(3);
          this.position = this.startPosition;
          // this.cardPositionService.dropzone = undefined;
        }
      } else {
        console.log(4);
        this.position = this.startPosition;
        // this.cardPositionService.dropzone = undefined;
      }

      this.cardPositionService.dropzone = undefined;
      this.cardPositionService.emitPosition(this.position);
      // this.cardPositionService.emitHelperCard(undefined);
      this.pointerMoveListener();
      this.pointerUpListener();

      /* Evento emitido para forzar una última vez el CD, una vez establecida la nueva posición */
      this.cardPositionService.emitDragging(this.dragging);
    }
  }

}
