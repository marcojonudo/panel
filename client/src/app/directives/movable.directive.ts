import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  HostBinding,
  HostListener, OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import {DomSanitizer, SafeStyle} from "@angular/platform-browser";
import {GlobalPositionStrategy, Overlay, OverlayRef} from "@angular/cdk/overlay";
import {Coordinates} from "../objects/coordinates";
import {DraggableDirective} from "./draggable.directive";
import {CardPositionService} from "../services/card-position.service";
import {Subscription} from "rxjs/internal/Subscription";

@Directive({
  selector: '[appMovable]',
  exportAs: 'appMovable'
})
export class MovableDirective implements OnInit, OnDestroy {

  @HostBinding('class.dragging') dragging: boolean;

  private position: Coordinates;
  private subscription: Subscription;

  // @HostBinding('class.draggable') draggable: boolean;
  // @HostBinding('class.dragging') dragging: boolean;

  @HostBinding('style.transform') get transform(): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(
      `translateX(${this.position.x}px) translateY(${this.position.y}px)`
    );
  }

  constructor(
    private cardPositionService: CardPositionService,
    private sanitizer: DomSanitizer,
    private element: ElementRef,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.dragging = true;
    // this.changeDetectorRef.detach();
    // this.changeDetectorRef.detectChanges();
  }

  ngOnInit() {
    this.subscription = this.cardPositionService.coordinates$.subscribe(coordinates => {
      // console.log('new position', coordinates);
      // console.log(this.element.nativeElement.getBoundingClientRect().left);
      this.position = coordinates;
      // console.log('appMovable', this.position);
      // this.changeDetectorRef.detectChanges()
    })
  }

  ngOnDestroy() {
    // console.log('on destroy');
    // this.element.nativeElement.remove();
    this.subscription.unsubscribe();
  }
  //
  // onDragStart(event: PointerEvent) {
  //   console.log('hola');
  // }


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
