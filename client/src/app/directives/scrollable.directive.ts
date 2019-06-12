import {Directive, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, Renderer2} from '@angular/core';
import {Constants} from "../objects/constants";

@Directive({
  selector: '[appScrollable]'
})
export class ScrollableDirective implements OnInit {

  @Input() scrollLeft: number;
  @Input() scrollTop: number;

  private left: number;
  private right: number;
  private top: number;
  private bottom: number;

  private scrollZoneSize: number;

  private speed: number;

  constructor(
    private element: ElementRef,
    private renderer: Renderer2
  ) {
    this.scrollZoneSize = 50;
    this.speed = 10;
  }

  ngOnInit() {
    const rect = this.element.nativeElement.getBoundingClientRect();
    this.left = rect.left + this.scrollZoneSize;
    this.right = rect.right - this.scrollZoneSize;
    this.top = rect.top + this.scrollZoneSize;
    this.bottom = rect.bottom - this.scrollZoneSize;
  }

  @HostListener('document:pointermove', ['$event'])
  onPointerMove(event: PointerEvent): void {
    if (event.clientX > this.right) {
      this.scrollLeft += this.speed;
      this.setScrollLeft(this.scrollLeft);
    } else if (event.clientX < this.left) {
      this.scrollLeft -= this.speed;
      this.setScrollLeft(this.scrollLeft);
    }

    if (event.clientY > this.bottom) {
      this.scrollTop += this.speed;
      this.setScrollTop(this.scrollTop);
    } else if (event.clientY < this.top) {
      this.scrollTop -= this.speed;
      this.setScrollTop(this.scrollTop);
    }
  }

  setScrollLeft(scrollLeft: number) {
    this.renderer.setProperty(
      this.element.nativeElement,
      Constants.PROPERTY.SCROLL_LEFT,
      scrollLeft
    );
  }

  setScrollTop(scrollTop: number) {
    this.renderer.setProperty(
      this.element.nativeElement,
      Constants.PROPERTY.SCROLL_TOP,
      scrollTop
    );
  }

}
