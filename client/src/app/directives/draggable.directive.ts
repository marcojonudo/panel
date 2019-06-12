import {
  Directive, ElementRef, EventEmitter,
  HostBinding,
  HostListener,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import {Coordinates} from "../objects/coordinates";
import {DomSanitizer, SafeStyle} from "@angular/platform-browser";
import {GlobalPositionStrategy, Overlay, OverlayRef} from "@angular/cdk/overlay";
import {TemplatePortal} from "@angular/cdk/portal";
import {CardPositionService} from "../services/card-position.service";

@Directive({
  selector: '[draggable]',
  exportAs: 'draggable'
})
export class DraggableDirective implements OnInit {

  @Output() dragStart: EventEmitter<PointerEvent>;
  @Output() dragMove: EventEmitter<PointerEvent>;
  @Output() dragEnd: EventEmitter<PointerEvent>;

  private overlayRef: OverlayRef;

  private cardRect;

  private startPosition: Coordinates;
  private startEventCoordinates: Coordinates;
  private position: Coordinates;

  @HostBinding('class.draggable') draggable: boolean;
  @HostBinding('class.dragging') dragging: boolean;

  constructor(
    private element: ElementRef,
    private cardPositionService: CardPositionService
  ) {
    this.dragStart = new EventEmitter<PointerEvent>();
    this.dragMove = new EventEmitter<PointerEvent>();
    this.dragEnd = new EventEmitter<PointerEvent>();

    this.draggable = true;
    this.dragging = false;

    this.position = new Coordinates(0, 0);
  }

  ngOnInit() {
    console.log('a');
    console.log(this.element.nativeElement.getBoundingClientRect());
    this.cardRect = this.element.nativeElement.getBoundingClientRect();
  }

  @HostListener('pointerdown', ['$event'])
  onPointerDown(event: PointerEvent): void {
    this.dragging = true;

    // const clientRect = this.element.nativeElement.getBoundingClientRect();

    this.startPosition = new Coordinates(
      this.cardRect.left,
      this.cardRect.top
    );

    this.startEventCoordinates = new Coordinates(event.clientX, event.clientY);

    this.dragStart.emit(event);
    this.cardPositionService.emitPosition(this.startPosition);

    this.cardPositionService.emitHelperCard();

    // this.overlayRef.attach(new TemplatePortal(this.templateRef, this.viewContainerRef))
  }

  @HostListener('document:pointermove', ['$event'])
  onPointerMove(event: PointerEvent): void {
    if (this.dragging) {
      // const clientRect = this.element.nativeElement.getBoundingClientRect();


      // this.position.x = event.clientX - clientRect.left;
      // this.position.y = event.clientY - clientRect.top;
      this.position.x = this.startPosition.x + event.clientX - this.startEventCoordinates.x;
      this.position.y = this.startPosition.y + event.clientY - this.startEventCoordinates.y;
      this.dragMove.emit(event);
      console.log('dragg');
      console.log(event.clientX);
      // console.log(this.position);
      this.cardPositionService.emitPosition(this.position);
    }
  }

  @HostListener('document:pointerup', ['$event'])
  onPointerUp(event: PointerEvent): void {
    if (this.dragging) {
      this.dragging = false;
      // this.position = new Coordinates(0, 0);
      this.dragEnd.emit(event);
    }
  }

}
