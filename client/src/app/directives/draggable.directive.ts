import {
  ChangeDetectorRef,
  Directive, ElementRef,
  HostBinding,
  HostListener, NgZone,
  OnInit, Renderer2,
} from '@angular/core';
import {Coordinates} from "../objects/coordinates";
import {CardPositionService} from "../services/card-position.service";

@Directive({
  selector: '[appDraggable]',
  exportAs: 'appDraggable'
})
export class DraggableDirective implements OnInit {

  private cardRect;

  private startPosition: Coordinates;
  private startEventCoordinates: Coordinates;
  private position: Coordinates;

  private pointerDownListener;
  private pointerMoveListener;
  private pointerUpListener;

  @HostBinding('class.draggable') draggable: boolean;
  @HostBinding('class.dragging') dragging: boolean;

  constructor(
    private element: ElementRef,
    private cardPositionService: CardPositionService,
    private renderer: Renderer2,
    private ngZone: NgZone,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.draggable = true;
    this.dragging = false;

    this.position = new Coordinates(0, 0);
    // this.changeDetectorRef.detach()
    // this.pointerDownListener = this.renderer.listen(this.element, 'pointerdown', this.onPointerDown.bind(this));
  }

  ngOnInit() {
    this.cardRect = this.element.nativeElement.getBoundingClientRect();
    console.log(this.element.nativeElement);
    this.pointerDownListener = this.renderer.listen(this.element.nativeElement, 'pointerdown', this.onPointerDown.bind(this));
  }

  // @HostListener('pointerdown', ['$event'])
  onPointerDown(event: PointerEvent): void {
    // event.preventDefault();
    // event.stopPropagation();
    this.dragging = true;

    this.startPosition = new Coordinates(
      this.cardRect.left,
      this.cardRect.top
    );

    this.startEventCoordinates = new Coordinates(event.clientX, event.clientY);

    this.cardPositionService.emitPosition(this.startPosition);
    this.cardPositionService.emitHelperCard({id: 1, width: 150});

    // this.ngZone.runOutsideAngular(() => {
    this.pointerMoveListener = this.renderer.listen('document', 'pointermove', this.onPointerMove.bind(this));
    this.pointerUpListener = this.renderer.listen('document', 'pointerup', this.onPointerUp.bind(this));

    // document.addEventListener('pointermove', this.onPointerMove.bind(this));
    // });
  }

  // @HostListener('document:pointermove', ['$event'])
  onPointerMove(event: PointerEvent): void {
    if (this.dragging) {
      this.position.x = this.startPosition.x + event.clientX - this.startEventCoordinates.x;
      this.position.y = this.startPosition.y + event.clientY - this.startEventCoordinates.y;
      this.cardPositionService.emitPosition(this.position);
    }
  }

  // @HostListener('document:pointerup', ['$event'])
  onPointerUp(event: PointerEvent): void {
    if (this.dragging) {
      this.dragging = false;
      this.cardPositionService.emitHelperCard(undefined);
      this.pointerMoveListener();
      this.pointerUpListener();

      // // TODO Revisar
      // this.ngZone.runOutsideAngular(() => {
      //   console.log(this.dragging);
      //   document.removeEventListener('pointermove', this.onPointerMove.bind(this));
      // });
    }
  }

}
