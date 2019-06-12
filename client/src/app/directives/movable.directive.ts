import {Directive, HostBinding, HostListener, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {DomSanitizer, SafeStyle} from "@angular/platform-browser";
import {GlobalPositionStrategy, Overlay, OverlayRef} from "@angular/cdk/overlay";
import {Coordinates} from "../objects/coordinates";
import {DraggableDirective} from "./draggable.directive";
import {CardPositionService} from "../services/card-position.service";

@Directive({
  selector: '[movable]',
  exportAs: 'movable'
})
export class MovableDirective implements OnInit {

  @HostBinding('class.dragging') dragging: boolean;

  private overlayRef: OverlayRef;

  private startPosition: Coordinates;
  private position: Coordinates;

  // @HostBinding('class.draggable') draggable: boolean;
  // @HostBinding('class.dragging') dragging: boolean;

  @HostBinding('style.transform') get transform(): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(
      `translate3d(${this.position.x}px, ${this.position.y}px, 0)`
    );
    // return this.sanitizer.bypassSecurityTrustStyle(
    //   `translateX(${this.position.x}px) translateY(${this.position.y}px`
    // );
  }

  constructor(
    private cardPositionService: CardPositionService,
    private sanitizer: DomSanitizer
    // private overlay: Overlay,
    // private templateRef: TemplateRef<any>,
    // private viewContainerRef: ViewContainerRef
  ) {
    this.dragging = true;
    // this.position = new Coordinates(0, 0);
  }

  ngOnInit() {
    this.cardPositionService.coordinates$.subscribe(coordinates => {
      // console.log(this.position);
      this.position = coordinates
    })
    // this.draggable.dragStart.subscribe(event => this.onDragStart(event))
    // this.overlayRef = this.overlay.create({positionStrategy: new GlobalPositionStrategy()})
  }

  onDragStart(event: PointerEvent) {
    console.log('hola');
  }

  ngOnDestroy() {
    // this.overlayRef.dispose();
  }

  // @HostListener('pointerdown', ['$event'])
  // onPointerDown(event: PointerEvent): void {
  //   this.dragging = true;
  //   this.startPosition = new Coordinates(
  //     event.clientX - this.position.x,
  //     event.clientY - this.position.y
  //   );
  //
  //   // this.overlayRef.attach(new TemplatePortal(this.templateRef, this.viewContainerRef))
  // }
  //
  // @HostListener('document:pointermove', ['$event'])
  // onPointerMove(event: PointerEvent): void {
  //   if (this.dragging) {
  //     this.position.x = event.clientX - this.startPosition.x;
  //     this.position.y = event.clientY - this.startPosition.y;
  //   }
  // }
  //
  // @HostListener('document:pointerup', ['$event'])
  // onPointerUp(event: PointerEvent): void {
  //   if (this.dragging) {
  //     this.dragging = false;
  //     this.position = new Coordinates(0, 0)
  //   }
  // }

}
